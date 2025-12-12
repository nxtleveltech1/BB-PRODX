"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
// import { useQuery } from "@tanstack/react-query";
// import api from "@/services/apiOptimized";
import { products } from "@/data/products";
import TopSixFlip from "@/components/TopSixFlip";
import { useCart } from "@/contexts/CartContext";

function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const hasDiscount =
    product.originalPrice && product.originalPrice !== product.price;
  const price =
    typeof product.price === "string" ? product.price : `R${product.price}`;
  const originalPrice =
    typeof product.originalPrice === "string"
      ? product.originalPrice
      : `R${product.originalPrice}`;

  // Identify pots that need 75% scaling
  const isPot = [
    "Aloe Gel",
    "Skin Therapy",
    "Day Care",
    "Night Care",
    "Eye Repair",
  ].includes(product.name);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart({
        productId: product.id,
        quantity: 1,
      });
    } catch (_err) {
      // no-op: provider shows toast
    }
  };

  const handleProductClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div
      className="group flex flex-col h-full transition-all duration-300 hover:shadow-lg"
      style={{ fontFamily: "League Spartan, sans-serif" }}
    >
      {/* Product Image */}
      <div
        className="relative aspect-square bg-[var(--bb-champagne)] overflow-hidden mb-4 cursor-pointer"
        onClick={handleProductClick}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-contain p-4 pointer-events-none transition-transform hover:scale-105 ${
              isPot ? "scale-75" : ""
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--bb-mahogany)]/20 to-[var(--bb-citron)]/20 flex items-center justify-center">
              <span className="text-3xl">🌿</span>
            </div>
          </div>
        )}
        {/* Stock Status Badge */}
        {!product.inStock && (
          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="bg-[var(--bb-black-bean)] text-white px-3 py-1 text-xs uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div
        className="flex flex-col flex-1 items-center text-center gap-3 px-2"
        style={{ fontFamily: "League Spartan, sans-serif" }}
      >
        <h3
          className="text-lg font-semibold uppercase tracking-wide text-[var(--bb-black-bean)] group-hover:text-[var(--bb-mahogany)] transition-colors duration-300 leading-tight cursor-pointer"
          style={{ fontFamily: "League Spartan, sans-serif" }}
          onClick={handleProductClick}
        >
          {product.name}
        </h3>
        <p className="text-sm text-[var(--bb-payne-gray)] leading-relaxed line-clamp-2 max-w-[26ch]">
          {product.description}
        </p>
        <div className="pt-2 border-t border-[var(--bb-mahogany)]/10 w-full">
          <div className="flex items-center justify-center gap-3">
            <span className="text-lg font-semibold text-[var(--bb-mahogany)]">
              {price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[var(--bb-payne-gray)] line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
        {/* Two buttons: Read more + Add to cart */}
        <div className="mt-auto w-full flex gap-2">
          <button
            onClick={handleProductClick}
            className="flex-1 bg-white border-2 border-[var(--bb-black-bean)] text-[var(--bb-black-bean)] py-3 text-sm tracking-wide uppercase hover:bg-[var(--bb-black-bean)] hover:text-white transition-all active:scale-95"
            style={{ fontFamily: "League Spartan, sans-serif" }}
          >
            READ MORE
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[var(--bb-black-bean)] text-white py-3 text-sm tracking-wide uppercase hover:bg-[var(--bb-mahogany)] transition-all active:scale-95"
            style={{ fontFamily: "League Spartan, sans-serif" }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}

const WL_KEY = "betterBeing_wishlist";

function upsertWishlistEntry(entry: {
  product_id: number;
  name: string;
  image: string;
  price: string | number;
}) {
  try {
    const raw = localStorage.getItem(WL_KEY);
    const list = raw ? (JSON.parse(raw) as any[]) : [];
    if (!list.some((it) => it.product_id === entry.product_id)) {
      list.push({ id: Date.now(), ...entry });
      localStorage.setItem(WL_KEY, JSON.stringify(list));
      toast.success("Added to wishlist");
    } else {
      toast.info("Already in wishlist");
    }
  } catch {
    toast.error("Could not update wishlist");
  }
}

function MobileProductCard({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const toNumber = (v: any) =>
    typeof v === "number"
      ? v
      : Number(String(v ?? "").replace(/[^0-9.]/g, "")) || 0;
  const priceNum = toNumber(product.price);
  const origNum =
    product.originalPrice != null ? toNumber(product.originalPrice) : NaN;
  const onSale = Number.isFinite(origNum) && origNum > priceNum;
  const discount = onSale
    ? Math.round(((origNum - priceNum) / origNum) * 100)
    : 0;

  // Identify pots that need 75% scaling
  const isPot = [
    "Aloe Gel",
    "Skin Therapy",
    "Day Care",
    "Night Care",
    "Eye Repair",
  ].includes(product.name);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart({
        productId: product.id,
        quantity: 1,
      });
    } catch (_err) {}
  };

  const handleProductClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="group block">
      <div
        className="bg-white rounded-xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] focus:ring-offset-2"
        onClick={handleProductClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleProductClick();
          }
        }}
        role="link"
        tabIndex={0}
        aria-label={product.name}
      >
        <div className="relative aspect-square bg-[var(--bb-champagne)]">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 pointer-events-none ${
              isPot ? "scale-75" : ""
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
            {product.popular && (
              <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-[var(--bb-black-bean)] text-white">
                Top Seller
              </span>
            )}
            {onSale && (
              <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-[var(--bb-citron)] text-[var(--bb-black-bean)]">
                -{discount}%
              </span>
            )}
          </div>
        </div>
        <div className="p-3 flex flex-col gap-2">
          <h3
            className="text-sm font-semibold leading-snug text-[var(--bb-black-bean)] line-clamp-2 group-hover:text-[var(--bb-mahogany)]"
            style={{ fontFamily: "League Spartan, sans-serif" }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[var(--bb-mahogany)] font-semibold">
              {typeof product.price === "string"
                ? product.price
                : `R${product.price}`}
            </span>
            {onSale && (
              <span className="text-xs text-[var(--bb-payne-gray)] line-through">
                {typeof product.originalPrice === "string"
                  ? product.originalPrice
                  : `R${product.originalPrice}`}
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleProductClick}
              className="flex-1 bg-white border-2 border-[var(--bb-black-bean)] text-[var(--bb-black-bean)] py-2.5 text-xs tracking-wider uppercase rounded transition-colors hover:bg-[var(--bb-black-bean)] hover:text-white active:scale-95"
              style={{ fontFamily: "League Spartan, sans-serif" }}
            >
              Read more
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[var(--bb-black-bean)] text-white py-2.5 text-xs tracking-wider uppercase rounded transition-colors hover:bg-[var(--bb-mahogany)] active:scale-95"
              style={{ fontFamily: "League Spartan, sans-serif" }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  // Temporarily disable API call and use local products directly
  // const { data } = useQuery({
  //   queryKey: ["products", { limit: 100 }],
  //   queryFn: () => api.getProducts({ limit: 100 }) as Promise<{ products: any[] }>,
  // });

  // Read filters from URL
  const searchParams = useSearchParams();
  const router = useRouter();

  // Safe wrapper for nullable searchParams in types
  const sp = searchParams ?? new URLSearchParams();

  const category = sp.get("category") ?? "";
  const saleParam = sp.get("sale") === "true";
  const popularParam = sp.get("popular") === "true";
  const maxPriceParam = Number.parseInt(sp.get("maxPrice") || "");
  const maxPrice = Number.isFinite(maxPriceParam) ? maxPriceParam : undefined;
  const sort = sp.get("sort") ?? "";

  const toNumber = (v: any) =>
    typeof v === "number"
      ? v
      : Number(String(v ?? "").replace(/[^0-9.]/g, "")) || 0;

  const isOnSale = (p: any) => {
    const priceNum = toNumber(p.price);
    const orig = p.originalPrice != null ? toNumber(p.originalPrice) : NaN;
    return Number.isFinite(orig) && orig > priceNum;
  };

  const filteredProducts = useMemo(() => {
    const base = products.filter((p: any) => {
      const categoryOk = !category || p.categoryId === category;
      const saleOk = !saleParam || isOnSale(p);
      const priceOk =
        maxPrice === undefined || toNumber(p.price) <= (maxPrice as number);
      const popularOk = !popularParam || p.popular === true;
      return categoryOk && saleOk && priceOk && popularOk;
    });

    const arr = [...base];
    switch (sort) {
      case "price-asc":
        arr.sort((a, b) => toNumber(a.price) - toNumber(b.price));
        break;
      case "price-desc":
        arr.sort((a, b) => toNumber(b.price) - toNumber(a.price));
        break;
      case "name-asc":
        arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        break;
      case "name-desc":
        arr.sort((a, b) => String(b.name).localeCompare(String(a.name)));
        break;
      default:
        break;
    }
    return arr;
  }, [category, saleParam, popularParam, maxPrice, sort]);

  // UI state for mobile sheets
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState<string>(category);
  const [draftPrice, setDraftPrice] = useState<string>(
    maxPrice ? String(maxPrice) : ""
  );
  const [draftSale, setDraftSale] = useState<boolean>(saleParam);
  const [draftSort, setDraftSort] = useState<string>(sort);

  const openFilter = () => {
    setDraftCategory(category);
    setDraftPrice(maxPrice ? String(maxPrice) : "");
    setDraftSale(saleParam);
    setFilterOpen(true);
  };
  const openSort = () => {
    setDraftSort(sort);
    setSortOpen(true);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(sp.toString());
    if (draftCategory) params.set("category", draftCategory);
    else params.delete("category");
    if (draftPrice) params.set("maxPrice", draftPrice);
    else params.delete("maxPrice");
    if (draftSale) params.set("sale", "true");
    else params.delete("sale");
    // Preserve popular param if already in URL
    if (popularParam) params.set("popular", "true");
    router.push(`/shop?${params.toString()}`);
    setFilterOpen(false);
  };
  const resetFilters = () => {
    setDraftCategory("");
    setDraftPrice("");
    setDraftSale(false);
  };
  const applySort = () => {
    const params = new URLSearchParams(sp.toString());
    if (draftSort) params.set("sort", draftSort);
    else params.delete("sort");
    router.push(`/shop?${params.toString()}`);
    setSortOpen(false);
  };

  // Mobile-specific view - using CSS classes instead of JS width check
  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden bg-[#F9E7C9]">
        {/* Mobile Hero */}
        <section className="relative min-h-[56vh] bg-[var(--bb-mahogany)] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/Platform Graphics/ChatGPT Image Sep 10, 2025 at 09_55_21 AM.png"
              alt="Shop hero"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />
          <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
            <div className="min-h-[56vh] pt-16 flex flex-col items-center justify-center text-center">
              <h1
                className="text-4xl font-light text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                style={{
                  fontFamily: "Playfair Display, serif",
                  letterSpacing: "0.05em",
                }}
              >
                THE BETTER WAY NATURAL, NO COMPROMISE
              </h1>
            </div>
          </div>
        </section>

        {/* Micro Banner */}
        <div className="px-4 py-2 bg-[var(--bb-citron)] text-center text-[var(--bb-black-bean)] text-xs font-bold tracking-wider">
          FREE DELIVERY FOR ORDERS OVER R800
        </div>

        {/* Category Chips - Hidden for launch */}
        {false && (
          <div className="px-4 py-4 bg-[#F9E7C9] border-b border-[var(--bb-mahogany)]/10 overflow-x-auto sticky top-20 z-30">
            <div className="flex items-center gap-2 min-w-max">
              {[
                {
                  label: "All",
                  href: "/shop",
                  active:
                    !category &&
                    !saleParam &&
                    !popularParam &&
                    maxPrice === undefined,
                },
                {
                  label: "Wellness Essentials",
                  href: "/shop?category=wellness-essentials",
                  active: category === "wellness-essentials",
                },
                {
                  label: "Natural Skincare",
                  href: "/shop?category=natural-skincare",
                  active: category === "natural-skincare",
                },
                {
                  label: "Digital Wellness",
                  href: "/shop?category=digital-products",
                  active: category === "digital-products",
                },
                {
                  label: "Under R250",
                  href: "/shop?maxPrice=250",
                  active: maxPrice === 250,
                },
                {
                  label: "Top Sellers",
                  href: "/shop?popular=true",
                  active: popularParam,
                },
                { label: "Sale", href: "/shop?sale=true", active: saleParam },
              ].map(({ label, href, active }) => (
                <Link
                  key={label}
                  href={href}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[var(--bb-black-bean)] text-white"
                      : "bg-white text-[var(--bb-black-bean)] border border-[var(--bb-black-bean)]/20"
                  }`}
                  style={{ fontFamily: "League Spartan, sans-serif" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sort / Filter Bar */}
        <div className="px-4 py-3 bg-[#F9E7C9] border-b border-[var(--bb-mahogany)]/10 flex items-center justify-between">
          <button
            onClick={openFilter}
            className="text-xs uppercase tracking-wider px-3 py-2 border border-[var(--bb-mahogany)]/20 text-[var(--bb-black-bean)]"
            style={{ fontFamily: "League Spartan, sans-serif" }}
          >
            Filter
          </button>
          <button
            onClick={openSort}
            className="text-xs uppercase tracking-wider px-3 py-2 border border-[var(--bb-mahogany)]/20 text-[var(--bb-black-bean)]"
            style={{ fontFamily: "League Spartan, sans-serif" }}
          >
            Sort
          </button>
        </div>

        {/* Active Filters Pills (mobile) */}
        {(category || saleParam || popularParam || maxPrice !== undefined) && (
          <div className="md:hidden px-4 py-2 bg-[#F9E7C9] border-b border-[var(--bb-mahogany)]/10 flex items-center gap-2 flex-wrap">
            {category && (
              <span className="px-3 py-1 text-xs rounded-full bg-white border border-[var(--bb-black-bean)]/20">
                {category}
              </span>
            )}
            {typeof maxPrice !== "undefined" && (
              <span className="px-3 py-1 text-xs rounded-full bg-white border border-[var(--bb-black-bean)]/20">
                Under R{maxPrice}
              </span>
            )}
            {saleParam && (
              <span className="px-3 py-1 text-xs rounded-full bg-white border border-[var(--bb-black-bean)]/20">
                Sale
              </span>
            )}
            {popularParam && (
              <span className="px-3 py-1 text-xs rounded-full bg-white border border-[var(--bb-black-bean)]/20">
                Top Sellers
              </span>
            )}
            <button
              onClick={() => router.push("/shop")}
              className="ml-auto text-xs underline text-[var(--bb-black-bean)]"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="px-4 py-6 grid grid-cols-2 gap-4">
          {filteredProducts.map((product: any) => (
            <MobileProductCard key={product.id} product={product} />
          ))}
        </div>
        {/* Filter Sheet */}
        {filterOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setFilterOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#F9E7C9] rounded-t-2xl p-6 shadow-2xl">
              <h3
                className="text-lg font-semibold text-[var(--bb-black-bean)]"
                style={{ fontFamily: "League Spartan, sans-serif" }}
              >
                Filter
              </h3>
              <div className="mt-4 space-y-6">
                <div>
                  <div
                    className="text-xs uppercase tracking-wider text-[var(--bb-mahogany)] mb-2"
                    style={{ fontFamily: "League Spartan, sans-serif" }}
                  >
                    Category
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "", label: "All" },
                      {
                        id: "wellness-essentials",
                        label: "Wellness Essentials",
                      },
                      { id: "natural-skincare", label: "Natural Skincare" },
                      { id: "digital-products", label: "Digital Wellness" },
                    ].map((opt) => (
                      <button
                        key={opt.id || "all"}
                        onClick={() => setDraftCategory(opt.id)}
                        className={`px-3 py-2 text-sm rounded-full border ${
                          draftCategory === opt.id
                            ? "bg-[var(--bb-black-bean)] text-white border-transparent"
                            : "bg-white text-[var(--bb-black-bean)] border-[var(--bb-black-bean)]/20"
                        }`}
                        style={{ fontFamily: "League Spartan, sans-serif" }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    className="text-xs uppercase tracking-wider text-[var(--bb-mahogany)] mb-2"
                    style={{ fontFamily: "League Spartan, sans-serif" }}
                  >
                    Price
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { val: "", label: "All" },
                      { val: "250", label: "Under R250" },
                      { val: "300", label: "Under R300" },
                      { val: "500", label: "Under R500" },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setDraftPrice(p.val)}
                        className={`px-3 py-2 text-sm rounded-full border ${
                          draftPrice === p.val
                            ? "bg-[var(--bb-black-bean)] text-white border-transparent"
                            : "bg-white text-[var(--bb-black-bean)] border-[var(--bb-black-bean)]/20"
                        }`}
                        style={{ fontFamily: "League Spartan, sans-serif" }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-[var(--bb-black-bean)]">
                    <input
                      type="checkbox"
                      checked={draftSale}
                      onChange={(e) => setDraftSale(e.target.checked)}
                    />
                    <span
                      className="text-sm"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Sale items only
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-[var(--bb-black-bean)]">
                    <input
                      type="checkbox"
                      checked={popularParam}
                      onChange={(e) => {
                        const params = new URLSearchParams(sp.toString());
                        if (e.target.checked) params.set("popular", "true");
                        else params.delete("popular");
                        router.push(`/shop?${params.toString()}`);
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Top sellers only
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[var(--bb-mahogany)] underline"
                    style={{ fontFamily: "League Spartan, sans-serif" }}
                  >
                    Reset
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="px-4 py-2 text-sm border border-[var(--bb-black-bean)]/20"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 text-sm bg-[var(--bb-black-bean)] text-white"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sort Sheet */}
        {sortOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSortOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#F9E7C9] rounded-t-2xl p-6 shadow-2xl">
              <h3
                className="text-lg font-semibold text-[var(--bb-black-bean)]"
                style={{ fontFamily: "League Spartan, sans-serif" }}
              >
                Sort
              </h3>
              <div className="mt-4 space-y-2">
                {[
                  { val: "", label: "Default" },
                  { val: "price-asc", label: "Price: Low to High" },
                  { val: "price-desc", label: "Price: High to Low" },
                  { val: "name-asc", label: "Name: A to Z" },
                  { val: "name-desc", label: "Name: Z to A" },
                ].map((o) => (
                  <label
                    key={o.val || "default"}
                    className="flex items-center justify-between py-2"
                  >
                    <span
                      className="text-sm text-[var(--bb-black-bean)]"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {o.label}
                    </span>
                    <input
                      type="radio"
                      name="sort"
                      checked={draftSort === o.val}
                      onChange={() => setDraftSort(o.val)}
                    />
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setDraftSort("");
                    applySort();
                  }}
                  className="px-4 py-2 text-sm border border-[var(--bb-black-bean)]/20"
                >
                  Clear
                </button>
                <button
                  onClick={applySort}
                  className="px-4 py-2 text-sm bg-[var(--bb-black-bean)] text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="min-h-screen hidden md:block">
        {/* Hero Section - Dramatic Brand Colors */}
        <section className="relative min-h-[70vh] bg-[var(--bb-mahogany)] text-white overflow-hidden">
          {/* Hero image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/Platform Graphics/ChatGPT Image Sep 10, 2025 at 09_55_21 AM.png"
              alt="Shop hero"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>

          {/* Hero Content */}
          <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
            <div className="min-h-[70vh] pt-24 flex flex-col items-center justify-center text-center">
              <h1
                className="text-hero text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                style={{ letterSpacing: "0.05em" }}
              >
                THE BETTER WAY NATURAL, NO COMPROMISE
              </h1>
            </div>
          </div>

          {/* Header spacer for absolute header overlap */}
          <div className="h-20"></div>
        </section>

        {/* Main Content */}
        <div className="bg-[#F9E7C9]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Monthly Favourites - Flip-through Top Six */}
            <div className="mb-8">
              <TopSixFlip />
            </div>

            {/* Products Grid - Rich Brand Layout */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Consultation CTA - Dramatic Background */}
        <section className="py-24 bg-[var(--bb-mahogany)] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="space-y-10">
              <h3
                className="text-4xl font-light text-white leading-tight"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Need <em className="text-[var(--bb-citron)]">Guidance?</em>
              </h3>
              <p className="text-xl leading-relaxed text-white/80 max-w-2xl mx-auto font-light">
                Our wellness experts are here to help you find the perfect
                products for your unique journey.
              </p>
              <div className="pt-6">
                <a
                  href="/contact"
                  className="bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-10 py-4 font-medium uppercase tracking-wider transition-all duration-300 hover:transform hover:scale-105"
                >
                  Book Consultation
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
