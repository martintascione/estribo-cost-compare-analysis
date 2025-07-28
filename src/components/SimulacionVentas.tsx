import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Package, DollarSign, Calculator, ArrowRight, Minus, Plus, Weight, Hash } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface SimulacionData {
  estribo: { medida: string; peso: number };
  proveedores: Array<{
    proveedor: { nombre: string };
    peso: number; // Peso específico por proveedor
    costoTotal1000: number;
    ventaTotal1000SinIva: number;
    ventaTotal1000ConIva: number;
    ivaDebito1000: number; // IVA de la venta
    ivaCredito1000: number; // IVA incluido en el costo
    ivaAPagar1000: number; // IVA neto a pagar
    gananciaTotal1000: number;
  }>;
}

interface Props {
  simulacion: SimulacionData[];
  simulacionPorUnidad?: SimulacionData[];
}

export const SimulacionVentas = ({ simulacion, simulacionPorUnidad = [] }: Props) => {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<string>('');
  const [modoPorUnidad, setModoPorUnidad] = useState(false);
  
  const datosActuales = modoPorUnidad ? simulacionPorUnidad : simulacion;
  
  // Obtener lista única de proveedores
  const proveedoresUnicos = Array.from(
    new Set(datosActuales.flatMap(item => 
      item.proveedores.map(prov => prov.proveedor.nombre)
    ))
  );

  // Inicializar el proveedor seleccionado con el primero disponible
  if (!proveedorSeleccionado && proveedoresUnicos.length > 0) {
    setProveedorSeleccionado(proveedoresUnicos[0]);
  }

  // Crear una estructura más simple para mostrar los datos
  const datosSimplificados = datosActuales.flatMap(item => 
    item.proveedores.map(prov => ({
      medida: item.estribo.medida,
      peso: prov.peso, // Usar el peso específico del proveedor
      proveedor: prov.proveedor.nombre,
      costoTotal: prov.costoTotal1000,
      ventaTotal: prov.ventaTotal1000ConIva,
      ivaDebito: prov.ivaDebito1000,
      ivaCredito: prov.ivaCredito1000,
      ivaAPagar: prov.ivaAPagar1000,
      ganancia: prov.gananciaTotal1000,
      roi: ((prov.gananciaTotal1000 / prov.costoTotal1000) * 100)
    }))
  );

  // Calcular totales para el proveedor seleccionado
  const datosFiltrados = datosSimplificados.filter(item => 
    item.proveedor === proveedorSeleccionado
  );

  const totales = datosFiltrados.reduce((acc, item) => ({
    costo: acc.costo + item.costoTotal,
    venta: acc.venta + item.ventaTotal,
    ivaDebito: acc.ivaDebito + item.ivaDebito,
    ivaCredito: acc.ivaCredito + item.ivaCredito,
    ivaAPagar: acc.ivaAPagar + item.ivaAPagar,
    ganancia: acc.ganancia + item.ganancia
  }), { costo: 0, venta: 0, ivaDebito: 0, ivaCredito: 0, ivaAPagar: 0, ganancia: 0 });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Calculator className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Simulación de Ventas</span>
        </div>
        <h2 className="text-3xl font-bold">
          Venta de 1,000 Unidades por Medida {modoPorUnidad ? '(Precio Fijo)' : '(Por Peso)'}
        </h2>
        <p className="text-muted-foreground text-lg">
          Análisis completo de costos, ventas y ganancias por proveedor
        </p>
        
        {/* Toggle para cambiar modo */}
        <div className="flex justify-center gap-2">
          <Button
            variant={!modoPorUnidad ? "default" : "outline"}
            onClick={() => setModoPorUnidad(false)}
            className="flex items-center gap-2"
          >
            <Weight className="w-4 h-4" />
            Por Peso (Kg)
          </Button>
          <Button
            variant={modoPorUnidad ? "default" : "outline"}
            onClick={() => setModoPorUnidad(true)}
            disabled={simulacionPorUnidad.length === 0}
            className="flex items-center gap-2"
          >
            <Hash className="w-4 h-4" />
            Por Unidad
          </Button>
        </div>
        
        {modoPorUnidad && simulacionPorUnidad.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Configure precios por unidad en la sección de Configuración para usar este modo
          </p>
        )}
      </div>

      {/* Tabla principal */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Resultados Detallados</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold text-center text-xs sm:text-sm px-2">Medida</TableHead>
                  <TableHead className="font-bold text-center text-xs sm:text-sm px-2 hidden sm:table-cell">Proveedor</TableHead>
                  <TableHead className="font-bold text-center text-xs sm:text-sm px-2 hidden lg:table-cell">
                    Peso Total
                    <div className="text-xs font-normal">(1,000 u)</div>
                  </TableHead>
                  <TableHead className="font-bold text-center text-xs sm:text-sm px-2">Costo</TableHead>
                  <TableHead className="font-bold text-center text-xs sm:text-sm px-2">
                    Venta
                    <div className="text-xs font-normal hidden sm:block">(con IVA)</div>
                  </TableHead>
                  <TableHead className="font-bold text-center text-xs sm:text-sm px-2 hidden md:table-cell">
                    IVA Pagar
                    <div className="text-xs font-normal">(neto)</div>
                  </TableHead>
                  <TableHead className="font-bold text-center text-xs sm:text-sm px-2">Ganancia</TableHead>
                  <TableHead className="font-bold text-center text-xs sm:text-sm px-2">% Gan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datosSimplificados.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="text-center font-semibold text-xs sm:text-sm px-2">
                      {item.medida}
                      <div className="sm:hidden text-xs text-muted-foreground">
                        {item.proveedor}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm px-2 hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">{item.proveedor}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs sm:text-sm px-2 hidden lg:table-cell">
                      {(item.peso * 1000).toFixed(1)} kg
                    </TableCell>
                    <TableCell className="text-center font-medium text-destructive text-xs sm:text-sm px-2">
                      {formatCurrency(item.costoTotal)}
                    </TableCell>
                    <TableCell className="text-center font-medium text-primary text-xs sm:text-sm px-2">
                      {formatCurrency(item.ventaTotal)}
                    </TableCell>
                    <TableCell className="text-center font-medium text-warning text-xs sm:text-sm px-2 hidden md:table-cell">
                      {formatCurrency(item.ivaAPagar)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-success text-xs sm:text-sm px-2">
                      {formatCurrency(item.ganancia)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-xs sm:text-sm px-2">
                      <Badge variant={item.roi > 50 ? "default" : "secondary"} className="text-xs">
                        {item.roi.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Información para móviles */}
          <div className="md:hidden p-3 bg-muted/30 text-xs text-muted-foreground">
            💡 Algunas columnas están ocultas en pantallas pequeñas. Usa una pantalla más grande para ver todos los detalles.
          </div>
        </CardContent>
      </Card>

      {/* Selector de proveedor para el resumen */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <label className="text-sm font-medium">Calcular resumen para:</label>
            <Select value={proveedorSeleccionado} onValueChange={setProveedorSeleccionado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {proveedoresUnicos.map(proveedor => (
                  <SelectItem key={proveedor} value={proveedor}>
                    {proveedor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de totales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card className="text-center">
          <CardContent className="pt-3 sm:pt-6 pb-3 sm:pb-6 px-2 sm:px-6">
            <DollarSign className="w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-destructive" />
            <p className="text-xs sm:text-sm text-muted-foreground">Costo Total</p>
            <p className="text-sm sm:text-2xl font-bold text-destructive">{formatCurrency(totales.costo)}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-3 sm:pt-6 pb-3 sm:pb-6 px-2 sm:px-6">
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-primary" />
            <p className="text-xs sm:text-sm text-muted-foreground">Venta Total</p>
            <p className="text-sm sm:text-2xl font-bold text-primary">{formatCurrency(totales.venta)}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center lg:col-span-1 col-span-2">
          <CardContent className="pt-3 sm:pt-6 pb-3 sm:pb-6 px-2 sm:px-6">
            <Calculator className="w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-warning" />
            <p className="text-xs sm:text-sm text-muted-foreground">IVA a Pagar (Neto)</p>
            <p className="text-sm sm:text-2xl font-bold text-warning">{formatCurrency(totales.ivaAPagar)}</p>
            <div className="text-xs text-muted-foreground mt-1 sm:mt-2 space-y-1 hidden sm:block">
              <div className="flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" />
                <span>Débito: {formatCurrency(totales.ivaDebito)}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Minus className="w-3 h-3" />
                <span>Crédito: {formatCurrency(totales.ivaCredito)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-gradient-to-br from-success/10 to-success/5 border-success/20 lg:col-span-1 col-span-2">
          <CardContent className="pt-3 sm:pt-6 pb-3 sm:pb-6 px-2 sm:px-6">
            <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-success" />
            <p className="text-xs sm:text-sm text-muted-foreground">Ganancia Total</p>
            <p className="text-sm sm:text-2xl font-bold text-success">{formatCurrency(totales.ganancia)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              % Gan: {((totales.ganancia / totales.costo) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card className="bg-gradient-to-r from-info/5 to-primary/5 border-info/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Resumen de la Simulación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Total de medidas analizadas:</span> {datosActuales.length}
              </div>
              <div>
                <span className="font-medium">Proveedores comparados:</span> {datosActuales[0]?.proveedores.length || 0}
              </div>
              <div>
                <span className="font-medium">Unidades totales:</span> {datosActuales.length * 1000}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};