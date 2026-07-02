"use client"

import { useState } from "react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, AlertTriangle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const initialProductsData: {
  collateralType: string
  term: number
  amortization: number
  discountRate: number
  collateralRequired: boolean
  revolvingLogic: string
}[] = [
  {
    collateralType: "Automobile(s)",
    term: 60,
    amortization: 84,
    discountRate: 100,
    collateralRequired: true,
    revolvingLogic: "Standard",
  },
  {
    collateralType: "Cash",
    term: 12,
    amortization: 144,
    discountRate: 100,
    collateralRequired: true,
    revolvingLogic: "N/A",
  },
  {
    collateralType: "Commercial Real Estate",
    term: 300,
    amortization: 300,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Construction (1-4 Family RE)",
    term: 12,
    amortization: 12,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Draw-based",
  },
  {
    collateralType: "Construction (CRE)",
    term: 12,
    amortization: 12,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Draw-based",
  },
  {
    collateralType: "Crops: Row",
    term: 60,
    amortization: 240,
    discountRate: 75,
    collateralRequired: true,
    revolvingLogic: "Seasonal Line",
  },
  {
    collateralType: "Crops: Grow",
    term: 60,
    amortization: 240,
    discountRate: 75,
    collateralRequired: true,
    revolvingLogic: "Seasonal Line",
  },
  {
    collateralType: "Depletable Assets",
    term: 60,
    amortization: 60,
    discountRate: 65,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Farmland",
    term: 300,
    amortization: 300,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Improved Property",
    term: 120,
    amortization: 120,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Intangible Assets",
    term: 60,
    amortization: 60,
    discountRate: 90,
    collateralRequired: false,
    revolvingLogic: "Special Case",
  },
  {
    collateralType: "Inventories",
    term: 12,
    amortization: 60,
    discountRate: 50,
    collateralRequired: true,
    revolvingLogic: "Revolving Line",
  },
  {
    collateralType: "Investment: Marketable",
    term: 60,
    amortization: 60,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Margin Loan",
  },
  {
    collateralType: "Investment: Non-Marketable",
    term: 60,
    amortization: 60,
    discountRate: 70,
    collateralRequired: true,
    revolvingLogic: "Special Case",
  },
  {
    collateralType: "Land Development",
    term: 0,
    amortization: 0,
    discountRate: 75,
    collateralRequired: true,
    revolvingLogic: "Draw-based",
  }, // Term/Amort 0 might be special
  {
    collateralType: "Loans to Related Parties",
    term: 60,
    amortization: 60,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Machinery / Heavy Equipment",
    term: 60,
    amortization: 180,
    discountRate: 90,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Office Equipment",
    term: 60,
    amortization: 60,
    discountRate: 75,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Other Assets",
    term: 60,
    amortization: 240,
    discountRate: 75,
    collateralRequired: false,
    revolvingLogic: "Varies",
  },
  {
    collateralType: "Other Current Assets",
    term: 60,
    amortization: 60,
    discountRate: 75,
    collateralRequired: false,
    revolvingLogic: "Varies",
  },
  {
    collateralType: "Other Vehicle Type(s)",
    term: 60,
    amortization: 180,
    discountRate: 100,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Personal Residence",
    term: 360,
    amortization: 360,
    discountRate: 90,
    collateralRequired: true,
    revolvingLogic: "Mortgage",
  },
  {
    collateralType: "Raw Land",
    term: 300,
    amortization: 300,
    discountRate: 65,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Real Estate Loans to Others",
    term: 60,
    amortization: 60,
    discountRate: 70,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Receivables",
    term: 12,
    amortization: 144,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Revolving Line",
  },
  {
    collateralType: "Rental 1-4 Family Real Estate",
    term: 300,
    amortization: 300,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Mortgage",
  },
  {
    collateralType: "Tax-Exempt Securities",
    term: 60,
    amortization: 60,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Margin Loan",
  },
  {
    collateralType: "Trailer Park",
    term: 120,
    amortization: 120,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Term Loan",
  },
  {
    collateralType: "Unsecured",
    term: 60,
    amortization: 240,
    discountRate: 0,
    collateralRequired: false,
    revolvingLogic: "Term Loan",
  }, // Discount Rate NA -> 0?
  {
    collateralType: "US Gov't Obligations",
    term: 60,
    amortization: 60,
    discountRate: 80,
    collateralRequired: true,
    revolvingLogic: "Margin Loan",
  },
]

const initialProducts: Product[] = initialProductsData.map((p, index) => ({
  id: `prod${index + 1}`,
  name: p.collateralType,
  term: p.term,
  amortization: p.amortization,
  baseRate: p.discountRate,
  collateralRequirement: p.collateralRequired,
  revolvingLogic: p.revolvingLogic,
  isPartiallyConfigured:
    !p.collateralType || p.term === undefined || p.amortization === undefined || p.baseRate === undefined,
}))

export function ProductSettings() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const { toast } = useToast()

  const checkPartiallyConfigured = (product: Product): boolean => {
    return !product.name?.trim() || product.term == null || product.amortization == null || product.baseRate == null
  }

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `prod${Date.now()}`,
      name: "",
      term: 0,
      amortization: 0,
      baseRate: 0,
      collateralRequirement: false,
      revolvingLogic: "",
      isPartiallyConfigured: true,
    }
    setProducts([...products, newProduct])
  }

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))
    toast({ title: "Product Removed" })
  }

  const handleChange = (id: string, field: keyof Product, value: any) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const newProduct = { ...product, [field]: value }
        newProduct.isPartiallyConfigured = checkPartiallyConfigured(newProduct)
        return newProduct
      }
      return product
    })
    setProducts(updatedProducts)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Product Settings</CardTitle>
        <CardDescription>
          Extract loan types, terms, amortization, base rate preferences, and revolving logic. Items marked{" "}
          <AlertTriangle className="inline h-4 w-4 mx-1 text-yellow-600" /> are partially complete.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Collateral Type</TableHead>
                <TableHead className="w-[100px]">Term (M)</TableHead>
                <TableHead className="w-[120px]">Amortization (M)</TableHead>
                <TableHead className="w-[100px]">Base Rate (%)</TableHead>
                <TableHead className="w-[100px] text-center">Collateral Req.</TableHead>
                <TableHead className="min-w-[150px]">Revolving Logic</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Input
                      value={product.name}
                      onChange={(e) => handleChange(product.id, "name", e.target.value)}
                      placeholder="e.g., Commercial RE"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.term}
                      onChange={(e) => handleChange(product.id, "term", Number.parseInt(e.target.value) || 0)}
                      placeholder="e.g., 60"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.amortization}
                      onChange={(e) => handleChange(product.id, "amortization", Number.parseInt(e.target.value) || 0)}
                      placeholder="e.g., 240"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.baseRate}
                      onChange={(e) => handleChange(product.id, "baseRate", Number.parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 5.0"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={product.collateralRequirement}
                      onCheckedChange={(checked) => handleChange(product.id, "collateralRequirement", !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={product.revolvingLogic}
                      onChange={(e) => handleChange(product.id, "revolvingLogic", e.target.value)}
                      placeholder="e.g., Revolving"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {product.isPartiallyConfigured ? (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        Incomplete
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        <Info className="h-3.5 w-3.5 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                      title="Remove Product"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button onClick={handleAddProduct} variant="outline" size="sm" className="bg-background text-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </CardContent>
    </Card>
  )
}

// Re-export for named import if needed elsewhere, though default is fine for page components
export default ProductSettings
