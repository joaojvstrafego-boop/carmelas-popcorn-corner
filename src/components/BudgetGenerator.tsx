import { useState, useRef } from "react";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

const emptyItem = (): BudgetItem => ({
  id: generateId(),
  product: "",
  quantity: 1,
  unitPrice: 0,
});

const BudgetGenerator = () => {
  const [companyName, setCompanyName] = useState("");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<BudgetItem[]>([emptyItem()]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const formatCurrency = (v: number) =>
    v.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  const generatePdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = 794; // A4-ish width at 96dpi
    const baseH = 900;
    const rowH = 36;
    const totalH = Math.max(baseH, 520 + items.length * rowH + 260);
    canvas.width = w;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, totalH);

    // Header bar
    const headerH = 100;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, w, headerH);

    // Logo icon (popcorn bucket)
    ctx.fillStyle = "#e94560";
    ctx.beginPath();
    ctx.moveTo(50, 25);
    ctx.lineTo(90, 25);
    ctx.lineTo(85, 75);
    ctx.lineTo(55, 75);
    ctx.closePath();
    ctx.fill();
    // Popcorn circles
    ctx.fillStyle = "#f5c518";
    [[62, 22], [78, 22], [70, 18], [58, 28], [82, 28]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Company name in header
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px 'DM Sans', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(companyName || "Mi Negocio de Palomitas", 110, 50);
    ctx.font = "14px 'DM Sans', Arial, sans-serif";
    ctx.fillStyle = "#cccccc";
    ctx.fillText("PRESUPUESTO", 110, 72);

    // Date
    const today = new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ctx.textAlign = "right";
    ctx.fillStyle = "#cccccc";
    ctx.font = "13px 'DM Sans', Arial, sans-serif";
    ctx.fillText(today, w - 40, 55);

    // Accent line
    ctx.fillStyle = "#e94560";
    ctx.fillRect(0, headerH, w, 4);

    let y = headerH + 40;

    // Client info
    ctx.textAlign = "left";
    ctx.fillStyle = "#666666";
    ctx.font = "13px 'DM Sans', Arial, sans-serif";
    ctx.fillText("CLIENTE:", 40, y);
    ctx.fillStyle = "#1a1a2e";
    ctx.font = "bold 16px 'DM Sans', Arial, sans-serif";
    ctx.fillText(clientName || "—", 110, y);
    y += 28;

    if (phone) {
      ctx.fillStyle = "#666666";
      ctx.font = "13px 'DM Sans', Arial, sans-serif";
      ctx.fillText("TEL:", 40, y);
      ctx.fillStyle = "#1a1a2e";
      ctx.font = "14px 'DM Sans', Arial, sans-serif";
      ctx.fillText(phone, 110, y);
      y += 28;
    }

    y += 16;

    // Table header
    const cols = { product: 40, qty: 420, unit: 530, total: 650 };
    ctx.fillStyle = "#f0f0f5";
    ctx.fillRect(30, y - 16, w - 60, 36);
    ctx.fillStyle = "#1a1a2e";
    ctx.font = "bold 13px 'DM Sans', Arial, sans-serif";
    ctx.fillText("PRODUCTO", cols.product, y + 4);
    ctx.fillText("CANT.", cols.qty, y + 4);
    ctx.fillText("PRECIO UNIT.", cols.unit, y + 4);
    ctx.textAlign = "right";
    ctx.fillText("TOTAL", w - 40, y + 4);
    ctx.textAlign = "left";
    y += 36;

    // Table rows
    ctx.font = "14px 'DM Sans', Arial, sans-serif";
    items.forEach((item, idx) => {
      if (idx % 2 === 1) {
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(30, y - 14, w - 60, rowH);
      }
      ctx.fillStyle = "#333333";
      ctx.fillText(item.product || "—", cols.product, y + 8);
      ctx.fillText(String(item.quantity), cols.qty, y + 8);
      ctx.fillText(formatCurrency(item.unitPrice), cols.unit, y + 8);
      ctx.textAlign = "right";
      ctx.fillText(formatCurrency(item.quantity * item.unitPrice), w - 40, y + 8);
      ctx.textAlign = "left";
      y += rowH;
    });

    // Divider
    y += 10;
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(w - 30, y);
    ctx.stroke();
    y += 24;

    // Subtotal
    ctx.font = "bold 18px 'DM Sans', Arial, sans-serif";
    ctx.fillStyle = "#1a1a2e";
    ctx.textAlign = "right";
    ctx.fillText(`TOTAL: ${formatCurrency(subtotal)}`, w - 40, y + 4);
    ctx.textAlign = "left";
    y += 40;

    // Notes
    if (notes) {
      ctx.fillStyle = "#666666";
      ctx.font = "bold 12px 'DM Sans', Arial, sans-serif";
      ctx.fillText("OBSERVACIONES:", 40, y);
      y += 20;
      ctx.font = "13px 'DM Sans', Arial, sans-serif";
      ctx.fillStyle = "#444444";
      // Word wrap notes
      const maxW = w - 80;
      const words = notes.split(" ");
      let line = "";
      words.forEach((word) => {
        const test = line + word + " ";
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line.trim(), 40, y);
          line = word + " ";
          y += 18;
        } else {
          line = test;
        }
      });
      if (line.trim()) ctx.fillText(line.trim(), 40, y);
      y += 30;
    }

    // Footer
    y = Math.max(y + 20, totalH - 50);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, totalH - 40, w, 40);
    ctx.fillStyle = "#999999";
    ctx.font = "11px 'DM Sans', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `${companyName || "Mi Negocio de Palomitas"} • Presupuesto generado automáticamente`,
      w / 2,
      totalH - 16
    );

    // Download
    const link = document.createElement("a");
    const fileName = `Presupuesto_${(clientName || "cliente").replace(/\s+/g, "_")}.png`;
    link.download = fileName;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const isValid = items.some((i) => i.product.trim() && i.unitPrice > 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="font-display text-xl tracking-wider text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Datos del Presupuesto
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="company">Nombre de tu empresa / marca</Label>
            <Input
              id="company"
              placeholder="Ej: Palomitas Deliciosas"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value.slice(0, 60))}
              maxLength={60}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client">Nombre del cliente</Label>
            <Input
              id="client"
              placeholder="Ej: María López"
              value={clientName}
              onChange={(e) => setClientName(e.target.value.slice(0, 60))}
              maxLength={60}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input
              id="phone"
              placeholder="Ej: +52 55 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0, 20))}
              maxLength={20}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-display text-xl tracking-wider text-foreground">
          Productos
        </h3>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_100px_40px] sm:grid-cols-[1fr_100px_120px_40px] gap-2 items-end"
            >
              <div className="space-y-1">
                {idx === 0 && <Label className="text-xs text-muted-foreground">Producto</Label>}
                <Input
                  placeholder="Ej: Palomitas de Nutella"
                  value={item.product}
                  onChange={(e) => updateItem(item.id, "product", e.target.value.slice(0, 80))}
                  maxLength={80}
                />
              </div>
              <div className="space-y-1">
                {idx === 0 && <Label className="text-xs text-muted-foreground">Cant.</Label>}
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>
              <div className="space-y-1">
                {idx === 0 && <Label className="text-xs text-muted-foreground">Precio</Label>}
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="0.00"
                  value={item.unitPrice || ""}
                  onChange={(e) =>
                    updateItem(item.id, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addItem} className="gap-1.5">
          <Plus className="w-4 h-4" /> Agregar producto
        </Button>

        {/* Running total */}
        <div className="flex justify-end pt-2 border-t border-border">
          <span className="font-display text-lg tracking-wider text-foreground">
            Total: {formatCurrency(subtotal)}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        <Label htmlFor="notes">Observaciones (opcional)</Label>
        <textarea
          id="notes"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-y"
          placeholder="Ej: Entrega el sábado 15 de marzo. Incluye empaques individuales."
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          maxLength={500}
        />
      </div>

      {/* Generate */}
      <Button
        onClick={generatePdf}
        disabled={!isValid}
        className="w-full gap-2 h-12 text-base"
      >
        <Download className="w-5 h-5" />
        Generar y Descargar Presupuesto
      </Button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default BudgetGenerator;
