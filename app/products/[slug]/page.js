import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { ChevronLeft, Download, MessageCircle, Phone, Mail, FileText } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import { motion } from 'framer-motion';

export async function generateMetadata({ params }) { const { slug } = await params; const product = await prisma.product.findUnique({ where: { slug },
    select: {
      name: true,
      shortDesc: true,
      description: true,
      metaTitle: true,
      metaDesc: true,
      featuredImage: true,
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  return {
    title: product.metaTitle || `${product.name} | Paul Scientific Works`,
    description:
      product.metaDesc || product.shortDesc || product.description?.substring(0, 160) || 'Premium scientific laboratory equipment',
    openGraph: {
      title: product.metaTitle || product.name,
      description:
        product.metaDesc || product.shortDesc || 'Premium scientific laboratory equipment',
      images: product.featuredImage ? [{ url: product.featuredImage }] : [],
    },
  };
}


export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        include: {
          institutionType: true,
        },
      },
      subCategory: true,
      images: true,
      pdfs: true,
    },
  });



  if (!product) {
    notFound();
  }

  let relatedProducts = [];
  if (product.categoryId) {
    relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        NOT: {
          id: product.id,
        },
      },
      include: {
        category: true,
        subCategory: true,
      },
      take: 6,
    });
  }

  let specifications = {};
  if (product.specifications) {
    try {
      specifications = JSON.parse(product.specifications);
    } catch (e) {
      specifications = {};
    }
  }

  let galleryImages = [];
  if (product.images) {
    try {
      galleryImages = JSON.parse(product.images);
    } catch (e) {
      galleryImages = [];
    }
  }

  let pdfs = [];
  if (product.pdfs) {
    try {
      pdfs = JSON.parse(product.pdfs);
    } catch (e) {
      pdfs = [];
    }
  }

  const whatsappMessage = `Hi, I'm interested in ${product.name} (Product Code: ${product.productCode}). Could you provide more information?`;
  const whatsappUrl = `https://wa.me/919813356463?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 overflow-x-auto">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap">
          Home
        </Link>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap">
          Products
        </Link>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <Link
          href={`/products?institutionId=${product.category?.institutionType?.id}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
        >
          {product.category?.institutionType?.name}
        </Link>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <Link
          href={`/products?categoryId=${product.categoryId}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
        >
          {product.category?.name}
        </Link>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <Link
          href={`/products?subCategoryId=${product.subCategoryId}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
        >
          {product.subCategory?.name}
        </Link>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="text-slate-900 dark:text-white whitespace-nowrap line-clamp-1">{product.name}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {/* Product Gallery - Left Column */}
          <div className="lg:col-span-2">
            <ProductGallery images={galleryImages} productName={product.name} />
          </div>
          </div>

          {/* Product Details - Center Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {product.category?.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {product.category?.institutionType?.name}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{product.name}</h1>

              <p className="text-base text-slate-600 dark:text-slate-400 mb-4">{product.shortDesc}</p>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    Product Code
                  </p>
                  <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                    {product.productCode}
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    Category
                  </p>
                  <p className="text-slate-900 dark:text-white">{product.category?.name}</p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    Subcategory
                  </p>
                  <p className="text-slate-900 dark:text-white">{product.subCategory?.name}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              
               <a
  href={whatsappUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
>
  <MessageCircle className="w-5 h-5" />
  <span>WhatsApp Inquiry</span>
</a>

              {pdfs && pdfs.length > 0 && (
  <a
    href={pdfs[0]}
    download
    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
  >
    <Download className="w-5 h-5" />
    <span>Download Catalogue</span>
  </a>
)}

              <Link href="/contact">
                <button className="w-full px-6 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Request Quote
                </button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase">
                Quick Contact
              </h3>
              <div className="space-y-2">
                
                <a
  href="tel:+919813356463"
  className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
>
  <Phone className="w-4 h-4 flex-shrink-0" />
  <span>+91-98133-56463</span>
</a>
                <a
                  href="mailto:paulscientificworks@gmail.com"
                  className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">paulscientificworks@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <section className="mb-16 bg-slate-50 dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Description</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </section>

        {/* Specifications Section */}
        {Object.keys(specifications).length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Technical Specifications
            </h2>
            <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700 border-b border-slate-300 dark:border-slate-700">
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-900 dark:text-white">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-900 dark:text-white">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(specifications).map(([key, value], idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                          {key}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

       
        {/* PDF Downloads Section */}
        {pdfs && pdfs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Documentation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pdfs.map((pdf, idx) => (
                <a
                  key={idx}
                  href={pdf}
                  download
                  className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      Product Documentation {idx > 0 && `(${idx + 1})`}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      PDF Document
                    </p>
                  </div>

                  <Download className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Related Products
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.slug}`}
                  className="group"
                >
                  <div className="h-full bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all p-4 cursor-pointer hover:-translate-y-1">
                    
                    <div className="w-full aspect-square bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg mb-4 overflow-hidden relative">
                      {related.featuredImage ? (
                        <Image
                          src={related.featuredImage}
                          alt={related.name}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-5xl font-bold text-slate-400">
                            {related.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {related.category?.name}
                      </p>

                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {related.name}
                      </h3>

                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {related.productCode}
                      </p>

                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {related.shortDesc}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      
    </main>
  );
}

