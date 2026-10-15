from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from html import escape
from pathlib import Path
from urllib.request import Request, urlopen
import json
import re
from urllib.parse import urlparse
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / "source-products-deduped.json"
SITE_DATA = ROOT / "public" / "data" / "product-content.json"
ASSET_ROOT = ROOT / "public" / "images" / "dovac-originals" / "product-detail"
THUMB_ROOT = ROOT / "public" / "images" / "dovac-originals" / "product-detail-optimized"
BASE = "https://dovac.nl"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
SKIP = {"head", "script", "style", "noscript", "svg", "nav", "header", "footer"}

class Node:
    def __init__(self, tag, attrs=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.children = []

    def text(self):
        return " ".join(" ".join(self._texts()).split())

    def _texts(self):
        for child in self.children:
            if isinstance(child, str):
                yield child
            else:
                yield from child._texts()

class TreeParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        if tag in SKIP or self.skip_depth:
            return
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        if tag in SKIP and self.skip_depth:
            self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        if not self.skip_depth and data.strip():
            self.stack[-1].children.append(data)

def descendants(node, tag=None, cls=None, ident=None):
    for child in node.children:
        if not isinstance(child, Node):
            continue
        classes = child.attrs.get("class", "").split()
        if (tag is None or child.tag == tag) and (cls is None or cls in classes) and (ident is None or child.attrs.get("id") == ident):
            yield child
        yield from descendants(child, tag, cls, ident)

def html_url(path):
    return BASE + path

def image_asset(node):
    src = node.attrs.get("src") or node.attrs.get("data-src") or ""
    if src.startswith("//"):
        src = "https:" + src
    return {"src": src, "alt": node.attrs.get("alt", ""), "title": node.attrs.get("title", "")}

def extract(path, expected_title=""):
    request = Request(html_url(path), headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml,*/*", "Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7"})
    try:
        with urlopen(request, timeout=45) as response:
            source = response.read().decode("utf-8", "replace")
            parser = TreeParser()
            parser.feed(source)
        root = parser.root
        h1s = [n.text() for n in descendants(root, "h1") if n.text()]
        descriptions = []
        for node in descendants(root, cls="productDescription"):
            descriptions.append({"html": "".join(child if isinstance(child, str) else serialize(child) for child in node.children), "text": node.text()})
        tables = []
        for table in descendants(root, "table"):
            rows = []
            for tr in descendants(table, "tr"):
                cells = [cell.text() for cell in descendants(tr) if cell.tag in {"th", "td"}]
                if cells:
                    rows.append(cells)
            if rows:
                tables.append(rows)
        docs = []
        product_links = []
        for node in descendants(root, "a"):
            classes = node.attrs.get("class", "").split()
            href = node.attrs.get("href", "")
            href_path = urlparse(href).path if href.startswith("http") else href
            if href_path.startswith("/nl/producten/"):
                product_links.append({"path": href_path, "text": node.text()})
            if "tile" in classes and href:
                docs.append({"title": node.text(), "href": href if href.startswith("http") else html_url(href), "images": [image_asset(i) for i in descendants(node, "img")]})
        images = []
        for node in descendants(root, "img"):
            classes = node.attrs.get("class", "").split()
            src = node.attrs.get("src", "")
            alt = node.attrs.get("alt", "")
            if src and (alt or "product" in src.lower()):
                images.append(image_asset(node))
        main_image = None
        for node in descendants(root, ident="mainImage"):
            main_anchor = next(descendants(node, "a"), None)
            main_img = next(descendants(node, "img"), None)
            if main_img:
                main_image = image_asset(main_img)
                if main_anchor and main_anchor.attrs.get("href"):
                    original = main_anchor.attrs["href"]
                    main_image["src"] = original if original.startswith("http") else "https:" + original if original.startswith("//") else html_url(original)
                break
        breadcrumb = [n.text() for n in descendants(root, cls="pagebackButtonContainer")]
        title = h1s[0] if h1s else expected_title
        # Preserve source page detail fields in the source order; empty fields mean the original page had none.
        return {"sourcePath": path, "sourceUrl": html_url(path), "title": title, "breadcrumb": breadcrumb[0] if breadcrumb else "", "descriptions": descriptions, "specificationTables": tables, "relatedDocuments": docs, "mainImage": main_image, "images": images, "productLinks": product_links, "httpStatus": response.status, "sourceBytes": len(source)}
    except Exception as error:
        return {"sourcePath": path, "sourceUrl": html_url(path), "title": expected_title, "error": str(error)}

def serialize(node):
    allowed = {"p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "b", "em", "i", "br", "sup", "sub"}
    if node.tag not in allowed:
        return "".join(escape(child) if isinstance(child, str) else serialize(child) for child in node.children)
    if node.tag == "br":
        return "<br>"
    return f"<{node.tag}>" + "".join(escape(child) if isinstance(child, str) else serialize(child) for child in node.children) + f"</{node.tag}>"

def slug_for(path):
    return path.rstrip("/").rsplit("/", 1)[-1]

def category_for(path):
    parts = path.strip("/").split("/")
    slug = parts[2] if len(parts) > 2 else ""
    labels = {
        "vacuumpompen": "Vacuümpompen",
        "draaischuifpompen": "Draaischuifpompen",
        "zijkanaalventilatoren": "Zijkanaalventilatoren",
        "turbo-blowers": "Turbo Blowers",
        "luchtmessen": "Luchtmessen",
        "systems": "Systems",
        "beluchters": "Beluchters",
        "spare-parts": "Spare parts",
    }
    return labels.get(slug, slug.replace("-", " ").title())

def download_main_image(item):
    image = item.get("mainImage") or {}
    source = image.get("src", "")
    if not source:
        return None
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    extension = Path(urlparse(source).path).suffix.lower() or ".jpg"
    name = re.sub(r"[^a-z0-9-]+", "-", slug_for(item["sourcePath"]).lower()).strip("-")
    target = ASSET_ROOT / f"{name}{extension}"
    if not target.exists():
        request = Request(source, headers={"User-Agent": UA, "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"})
        try:
            with urlopen(request, timeout=45) as response:
                payload = response.read()
            if not payload:
                return None
            target.write_bytes(payload)
        except Exception as error:
            print(f"IMAGE ERROR {source}: {error}")
            return None
    optimized = THUMB_ROOT / f"{name}.webp"
    if not optimized.exists():
        THUMB_ROOT.mkdir(parents=True, exist_ok=True)
        with Image.open(target) as image:
            image = ImageOps.exif_transpose(image)
            image = ImageOps.contain(image, (960, 860), method=Image.Resampling.LANCZOS)
            image.save(optimized, "WEBP", quality=90, method=6)
    return f"product-detail-optimized/{optimized.name}"

def build_site_data(results):
    catalogue = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    category_map = {entry["href"]: entry["categoryTitle"] for entry in catalogue}
    # Product category pages without a product description or specification table
    # are navigation hubs; their individual product pages are included instead.
    products = [item for item in results if item.get("descriptions") or item.get("specificationTables")]
    for item in products:
        item["category"] = category_map.get(item["sourcePath"], category_for(item["sourcePath"]))
        item["slug"] = slug_for(item["sourcePath"])
        item["localImage"] = download_main_image(item)
        if item.get("mainImage"):
            item["mainImage"]["src"] = item["localImage"]
        item.pop("images", None)
        item.pop("productLinks", None)
        for document in item.get("relatedDocuments", []):
            document["title"] = re.sub(r"\s*Bekijken\s*›\s*$", "", document["title"]).strip()
            document["sourcePath"] = urlparse(document["href"]).path
            # Request forms on the source website gate the original downloads;
            # keep the exact document identity and provide a truthful email request.
            document.pop("href", None)
            document.pop("images", None)
    SITE_DATA.parent.mkdir(parents=True, exist_ok=True)
    SITE_DATA.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    return products

catalogue = json.loads(CATALOGUE.read_text(encoding="utf-8"))
paths = {}
for item in catalogue:
    paths[item["href"]] = item["title"]
base_pages = list(paths.items())
with ThreadPoolExecutor(max_workers=6) as pool:
    base_results = list(pool.map(lambda item: extract(item[0], item[1]), base_pages))
for result in base_results:
    for link in result.get("productLinks", []):
        paths[link["path"]] = link["text"].replace("Bekijken ›", "").strip()
additional_pages = [(path, title) for path, title in paths.items() if path not in dict(base_pages)]
with ThreadPoolExecutor(max_workers=6) as pool:
    additional_results = list(pool.map(lambda item: extract(item[0], item[1]), additional_pages))
results = base_results + additional_results
failures = [item for item in results if item.get("error")]
products = build_site_data(results)
print(json.dumps({"pagesRequested": len(paths), "pagesFetched": len(results) - len(failures), "failures": failures, "productRecords": len(products), "withDescription": sum(bool(item.get("descriptions")) for item in products), "withTables": sum(bool(item.get("specificationTables")) for item in products), "withDocuments": sum(bool(item.get("relatedDocuments")) for item in products), "totalDocuments": sum(len(item.get("relatedDocuments", [])) for item in products), "productImages": sum(bool(item.get("localImage")) for item in products), "output": str(SITE_DATA)}, ensure_ascii=False, indent=2))
