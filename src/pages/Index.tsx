import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { useEstribosData } from "@/hooks/useEstribosData";
import { FormularioProveedores } from "@/components/FormularioProveedores";
import { FormularioEstribos } from "@/components/FormularioEstribos";
import { ConfiguracionVenta } from "@/components/ConfiguracionVenta";
import { PreciosPorUnidad } from "@/components/PreciosPorUnidad";
import { ComparacionPrecios } from "@/components/ComparacionPrecios";
import { SimulacionVentas } from "@/components/SimulacionVentas";

const Index = () => {
  const {
    proveedores,
    estribos,
    preciosPorUnidad,
    configuracion,
    loading,
    setConfiguracion,
    agregarProveedor,
    agregarEstribo,
    eliminarProveedor,
    eliminarEstribo,
    actualizarConfiguracion,
    actualizarPrecioPorUnidad,
    calcularDatos,
    calcularDatosPorUnidad,
    calcularSimulacionVentas,
    calcularSimulacionVentasPorUnidad
  } = useEstribosData();

  const calculosDetallados = calcularDatos();
  const calculosDetalladosPorUnidad = calcularDatosPorUnidad();
  const simulacionVentas = calcularSimulacionVentas();
  const simulacionVentasPorUnidad = calcularSimulacionVentasPorUnidad();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Sistema de Análisis de Costos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Calculadora de Estribos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistema completo para análisis de costos, precios de venta y simulaciones financieras
          </p>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="configuracion" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto gap-1">
            <TabsTrigger value="configuracion" className="flex-col gap-1 py-2 px-2 text-center">
              <span className="font-medium text-sm">Configuración</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Datos de entrada</span>
            </TabsTrigger>
            <TabsTrigger value="analisis" className="flex-col gap-1 py-2 px-2 text-center">
              <span className="font-medium text-sm">Análisis</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Comparación y precios</span>
            </TabsTrigger>
            <TabsTrigger value="simulacion" className="flex-col gap-1 py-2 px-2 text-center">
              <span className="font-medium text-sm">Simulación</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Ventas masivas</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab de Configuración */}
          <TabsContent value="configuracion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormularioProveedores
                proveedores={proveedores}
                onAgregarProveedor={agregarProveedor}
                onEliminarProveedor={eliminarProveedor}
              />
              
              <FormularioEstribos
                estribos={estribos}
                proveedores={proveedores}
                onAgregarEstribo={agregarEstribo}
                onEliminarEstribo={eliminarEstribo}
              />
            </div>
            
            <div className="space-y-6">
              <ConfiguracionVenta
                configuracion={configuracion}
                onCambiarConfiguracion={setConfiguracion}
                onActualizarConfiguracion={actualizarConfiguracion}
              />
              
              <PreciosPorUnidad
                estribos={estribos}
                preciosPorUnidad={preciosPorUnidad}
                onActualizarPrecio={actualizarPrecioPorUnidad}
              />
            </div>
          </TabsContent>

          {/* Tab de Análisis */}
          <TabsContent value="analisis" className="space-y-6">
            <ComparacionPrecios 
              calculos={calculosDetallados} 
              calculosPorUnidad={calculosDetalladosPorUnidad}
            />
          </TabsContent>

          {/* Tab de Simulación */}
          <TabsContent value="simulacion" className="space-y-6">
            <SimulacionVentas 
              simulacion={simulacionVentas}
              simulacionPorUnidad={simulacionVentasPorUnidad}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;