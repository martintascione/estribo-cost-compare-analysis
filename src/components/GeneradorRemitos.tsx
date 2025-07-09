import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Receipt, Calculator, DollarSign, TrendingUp } from "lucide-react";
import { Proveedor, Estribo, ConfiguracionVenta, PrecioPorUnidad } from "@/hooks/useEstribosData";

interface GeneradorRemitosProps {
  proveedores: Proveedor[];
  estribos: Estribo[];
  configuracion: ConfiguracionVenta;
  preciosPorUnidad: PrecioPorUnidad[];
}

interface DatosRemito {
  nombreCliente: string;
  cuit: string;
  cantidad: number;
  estriboPrecioId: string;
  detalleProducto: string;
  proveedorId: string;
}

export const GeneradorRemitos = ({ 
  proveedores, 
  estribos, 
  configuracion, 
  preciosPorUnidad 
}: GeneradorRemitosProps) => {
  const [datosRemito, setDatosRemito] = useState<DatosRemito>({
    nombreCliente: "",
    cuit: "",
    cantidad: 1,
    estriboPrecioId: "",
    detalleProducto: "",
    proveedorId: ""
  });

  // Buscar el proveedor "chino" y establecerlo por defecto
  useEffect(() => {
    const proveedorChino = proveedores.find(p => 
      p.nombre.toLowerCase().includes("chino") || 
      p.nombre.toLowerCase().includes("china")
    );
    if (proveedorChino && !datosRemito.proveedorId) {
      setDatosRemito(prev => ({ ...prev, proveedorId: proveedorChino.id }));
    }
  }, [proveedores, datosRemito.proveedorId]);

  const estriboPrecioSeleccionado = estribos.find(e => e.id === datosRemito.estriboPrecioId);
  const proveedorSeleccionado = proveedores.find(p => p.id === datosRemito.proveedorId);
  const precioPorUnidad = preciosPorUnidad.find(p => p.estriboPrecioId === datosRemito.estriboPrecioId);

  const calcularPrecios = () => {
    if (!estriboPrecioSeleccionado || !proveedorSeleccionado || !datosRemito.cantidad) {
      return {
        precioUnitario: 0,
        precioTotal: 0,
        costoUnitario: 0,
        costoTotal: 0,
        gananciaUnitaria: 0,
        gananciaTotal: 0,
        ivaDebito: 0,
        ivaCredito: 0,
        ivaNeto: 0
      };
    }

    let precioUnitario = 0;
    let costoUnitario = 0;

    // Verificar si existe precio por unidad configurado
    if (precioPorUnidad && precioPorUnidad.precioUnitario > 0) {
      // Usar precio por unidad
      precioUnitario = precioPorUnidad.precioUnitario;
      const pesoEspecifico = estriboPrecioSeleccionado.pesosPorProveedor[proveedorSeleccionado.id] || 0;
      costoUnitario = pesoEspecifico * proveedorSeleccionado.precioPorKg;
    } else {
      // Calcular usando margen de ganancia
      const pesoEspecifico = estriboPrecioSeleccionado.pesosPorProveedor[proveedorSeleccionado.id] || 0;
      costoUnitario = pesoEspecifico * proveedorSeleccionado.precioPorKg;
      const costoConMargen = costoUnitario * (1 + configuracion.margenGanancia / 100);
      const ivaAmount = costoConMargen * (configuracion.iva / 100);
      precioUnitario = costoConMargen + ivaAmount;
    }

    const precioTotal = precioUnitario * datosRemito.cantidad;
    const costoTotal = costoUnitario * datosRemito.cantidad;

    // Cálculos de IVA
    const ivaDebito = precioTotal * (configuracion.iva / (100 + configuracion.iva));
    const ivaCredito = costoTotal * (21 / 121); // Asumiendo IVA 21% en compras
    const ivaNeto = ivaDebito - ivaCredito;

    const gananciaUnitaria = precioUnitario - costoUnitario;
    const gananciaTotal = precioTotal - costoTotal - ivaNeto;

    return {
      precioUnitario,
      precioTotal,
      costoUnitario,
      costoTotal,
      gananciaUnitaria,
      gananciaTotal,
      ivaDebito,
      ivaCredito,
      ivaNeto
    };
  };

  const calculos = calcularPrecios();

  const generarRemito = () => {
    if (!datosRemito.nombreCliente || !datosRemito.cuit || !datosRemito.estriboPrecioId || !datosRemito.proveedorId) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Aquí se podría implementar la generación del PDF o envío a base de datos
    console.log("Datos del remito:", {
      ...datosRemito,
      estribo: estriboPrecioSeleccionado?.medida,
      proveedor: proveedorSeleccionado?.nombre,
      calculos
    });

    alert("Remito generado correctamente (ver consola para detalles)");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Receipt className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Generador de Remitos</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Generar Remito de Venta</h2>
        <p className="text-muted-foreground">
          Completa los datos del cliente y producto para generar el remito
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Datos del Remito
            </CardTitle>
            <CardDescription>
              Ingresa la información del cliente y producto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreCliente">Nombre del Cliente *</Label>
                <Input
                  id="nombreCliente"
                  placeholder="Ej: Juan Pérez"
                  value={datosRemito.nombreCliente}
                  onChange={(e) => setDatosRemito(prev => ({ ...prev, nombreCliente: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cuit">CUIT *</Label>
                <Input
                  id="cuit"
                  placeholder="XX-XXXXXXXX-X"
                  value={datosRemito.cuit}
                  onChange={(e) => setDatosRemito(prev => ({ ...prev, cuit: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad *</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  value={datosRemito.cantidad}
                  onChange={(e) => setDatosRemito(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medidaEstribo">Medida del Estribo *</Label>
                <Select 
                  value={datosRemito.estriboPrecioId} 
                  onValueChange={(value) => setDatosRemito(prev => ({ ...prev, estriboPrecioId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona medida" />
                  </SelectTrigger>
                  <SelectContent>
                    {estribos.map((estribo) => (
                      <SelectItem key={estribo.id} value={estribo.id}>
                        {estribo.medida}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor *</Label>
              <Select 
                value={datosRemito.proveedorId} 
                onValueChange={(value) => setDatosRemito(prev => ({ ...prev, proveedorId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map((proveedor) => (
                    <SelectItem key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="detalleProducto">Detalle del Producto</Label>
              <Textarea
                id="detalleProducto"
                placeholder="Descripción adicional del producto..."
                value={datosRemito.detalleProducto}
                onChange={(e) => setDatosRemito(prev => ({ ...prev, detalleProducto: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={generarRemito} 
                className="w-full" 
                size="lg"
                disabled={!datosRemito.nombreCliente || !datosRemito.cuit || !datosRemito.estriboPrecioId || !datosRemito.proveedorId}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Generar Remito
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Administración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Panel de Administración
            </CardTitle>
            <CardDescription>
              Análisis financiero de la venta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {estriboPrecioSeleccionado && proveedorSeleccionado ? (
              <>
                {/* Información del Producto */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN DEL PRODUCTO</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Estribo: <span className="font-medium">{estriboPrecioSeleccionado.medida}</span></div>
                    <div>Proveedor: <span className="font-medium">{proveedorSeleccionado.nombre}</span></div>
                    <div>Peso: <span className="font-medium">{estriboPrecioSeleccionado.pesosPorProveedor[proveedorSeleccionado.id] || 0} kg</span></div>
                    <div>Cantidad: <span className="font-medium">{datosRemito.cantidad} unidades</span></div>
                  </div>
                </div>

                <Separator />

                {/* Valores Totales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <DollarSign className="w-6 h-6 mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold text-primary">${calculos.precioTotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Valor Total de Venta</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg text-center">
                    <TrendingUp className="w-6 h-6 mx-auto text-red-600 mb-1" />
                    <p className="text-lg font-bold text-red-600">${calculos.costoTotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Gasto Total</p>
                  </div>
                </div>

                <Separator />

                {/* Desglose Detallado */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">DESGLOSE FINANCIERO</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precio Unitario:</span>
                      <span className="font-medium">${calculos.precioUnitario.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Costo Unitario:</span>
                      <span className="font-medium">${calculos.costoUnitario.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-sm">
                      <span>IVA Débito:</span>
                      <span className="font-medium">${calculos.ivaDebito.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>IVA Crédito:</span>
                      <span className="font-medium">${calculos.ivaCredito.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm font-medium border-t pt-2">
                      <span>IVA Neto a Pagar:</span>
                      <span className={calculos.ivaNeto >= 0 ? "text-red-600" : "text-green-600"}>
                        ${calculos.ivaNeto.toFixed(2)}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-base font-bold border-t pt-2">
                      <span>Ganancia Total:</span>
                      <span className={calculos.gananciaTotal >= 0 ? "text-green-600" : "text-red-600"}>
                        ${calculos.gananciaTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 Los cálculos tienen en cuenta tu margen de ganancia configurado ({configuracion.margenGanancia}%) 
                    y el IVA ({configuracion.iva}%).
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Selecciona un estribo y proveedor para ver el análisis financiero</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};