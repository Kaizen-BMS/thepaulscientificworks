"use client";
import { useEffect, useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(d => { if (d.data) setProduct(d.data); })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return <ProductForm mode="edit" initialData={product} />;
}