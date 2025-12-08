import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Loader2, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  categoryId: string;
  sku?: string;
  brand?: string;
  imageUrl?: string;
  images?: string[];
  stock: number;
  featured: boolean;
  isPublished: boolean;
  isDeal: boolean;
  specifications: Record<string, string>;
  careGuide?: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductsManagement() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products", { search, categoryId: categoryFilter !== "all" ? categoryFilter : undefined, isPublished: publishedFilter !== "all" ? publishedFilter : undefined }],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const togglePublishMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PUT", `/api/admin/products/${id}/toggle-publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product updated", description: "Product visibility has been changed" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product deleted", description: "Product has been removed" });
    },
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  const filteredProducts = products?.filter((product) => {
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const paginatedProducts = filteredProducts?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-500"
              onClick={() => setEditingProduct(null)}
              data-testid="button-add-product"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product details" : "Add a new product to your catalog"}
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              categories={categories || []}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-products"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={publishedFilter} onValueChange={setPublishedFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-published-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">SKU</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts?.map((product) => (
                    <tr key={product.id} className="border-b last:border-0" data-testid={`row-product-${product.id}`}>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm font-mono">{product.sku || "-"}</td>
                      <td className="py-3 px-2">
                        <div className="text-sm font-medium">{formatCurrency(product.price)}</div>
                        {product.originalPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatCurrency(product.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-sm">{product.stock}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.isPublished}
                            onCheckedChange={() => togglePublishMutation.mutate(product.id)}
                            data-testid={`switch-product-status-${product.id}`}
                          />
                          <Badge variant={product.isPublished ? "default" : "secondary"}>
                            {product.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsDialogOpen(true);
                            }}
                            data-testid={`button-edit-product-${product.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(product.id)}
                            className="text-red-600"
                            data-testid={`button-delete-product-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!paginatedProducts || paginatedProducts.length === 0) && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="py-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="px-4 text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProductForm({
  product,
  categories,
  onClose,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    categoryId: product?.categoryId || "",
    sku: product?.sku || "",
    brand: product?.brand || "",
    stock: product?.stock?.toString() || "0",
    featured: product?.featured || false,
    isPublished: product?.isPublished ?? true,
    isDeal: product?.isDeal || false,
    specifications: product?.specifications || {},
    careGuide: product?.careGuide || "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || (product?.imageUrl ? [product.imageUrl] : []));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("originalPrice", formData.originalPrice);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("sku", formData.sku);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("featured", String(formData.featured));
      formDataToSend.append("isPublished", String(formData.isPublished));
      formDataToSend.append("isDeal", String(formData.isDeal));
      formDataToSend.append("careGuide", formData.careGuide);

      formDataToSend.append("specifications", JSON.stringify(formData.specifications));

      // Append existing images for edit mode
      if (product) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // Append new images
      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // We need to use fetch directly or axios for FormData usually, or ensure apiRequest handles it.
      // Assuming apiRequest handles JSON by default. If it uses proper headers for FormData, it should be fine.
      // But usually we allow browser to set Content-Type for FormData.
      // Let's check apiRequest implementation? It might set Content-Type: application/json.
      // To be safe, let's use a specialized request or modify how we call it.
      // Since I can't check apiRequest easily without reading lib/queryClient, I'll assume standard fetch behavior or override headers.

      // Using standard fetch for multipart/form-data to avoid header issues
      const res = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: product ? "Product updated" : "Product created",
        description: `Product has been ${product ? "updated" : "created"} successfully`,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product`,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [newSpecKey]: newSpecValue
        }
      });
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Product Images</Label>
        <div className="flex flex-wrap gap-4 mb-2">
          {existingImages.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden group">
              <img src={img} alt="Product" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {/* Preview new images */}
          {images.map((img, idx) => (
            <div key={`new-${idx}`} className="relative w-20 h-20 border rounded overflow-hidden">
              <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover opacity-70" />
            </div>
          ))}
        </div>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          data-testid="input-product-images"
        />
        <p className="text-xs text-muted-foreground">Upload one or multiple images.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            data-testid="input-product-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            data-testid="input-product-sku"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          data-testid="input-product-description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="careGuide">Care Guide</Label>
        <Textarea
          id="careGuide"
          value={formData.careGuide}
          onChange={(e) => setFormData({ ...formData, careGuide: e.target.value })}
          rows={3}
          placeholder="Enter care instructions..."
          data-testid="input-product-care-guide"
        />
      </div>

      <div className="space-y-2">
        <Label>Specifications</Label>
        <div className="border rounded-md p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2">
              <Input
                placeholder="Key (e.g. Material)"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                placeholder="Value (e.g. Cotton)"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Button type="button" onClick={addSpecification} variant="secondary" className="w-full">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {Object.entries(formData.specifications).length > 0 && (
            <div className="space-y-2">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="font-medium text-sm">{key}:</span>
                  <span className="text-sm text-gray-600 flex-1 mx-2 truncate">{value as string}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpecification(key)}
                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            data-testid="input-product-price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price (Optional)</Label>
          <Input
            id="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            data-testid="input-product-original-price"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger data-testid="select-product-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            data-testid="input-product-brand"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input
          id="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          data-testid="input-product-stock"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="isPublished"
            checked={formData.isPublished}
            onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
            data-testid="switch-product-published"
          />
          <Label htmlFor="isPublished">Published</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            data-testid="switch-product-featured"
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isDeal"
            checked={formData.isDeal}
            onCheckedChange={(checked) => setFormData({ ...formData, isDeal: checked })}
            data-testid="switch-product-deal"
          />
          <Label htmlFor="isDeal">Deal</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-product">
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500"
          disabled={isSubmitting}
          data-testid="button-save-product"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
          ) : (
            product ? "Update Product" : "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
