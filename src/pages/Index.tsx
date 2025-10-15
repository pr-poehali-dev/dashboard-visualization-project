import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface KPICardProps {
  title: string;
  value: string;
  unit: string;
  target: string;
  status: 'success' | 'warning' | 'error';
  icon: string;
  trend?: number;
}

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
  icon: string;
}

const PieChart = ({ data, title, icon }: PieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const createSlice = (percentage: number, color: string, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = 50 + 45 * Math.cos(startRad);
    const y1 = 50 + 45 * Math.sin(startRad);
    const x2 = 50 + 45 * Math.cos(endRad);
    const y2 = 50 + 45 * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return {
      path: `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color,
      nextAngle: endAngle
    };
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Icon name={icon} size={20} className="text-muted-foreground" />
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const slice = createSlice(percentage, item.color, currentAngle);
              currentAngle = slice.nextAngle;
              return (
                <path
                  key={index}
                  d={slice.path}
                  fill={slice.color}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
            <circle cx="50" cy="50" r="20" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{total}</div>
              <div className="text-xs text-muted-foreground">Всего</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3 w-full">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  <span className="text-xs text-muted-foreground">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

const KPICard = ({ title, value, unit, target, status, icon, trend }: KPICardProps) => {
  const statusColors = {
    success: 'text-[#10B981] bg-[#10B981]/10',
    warning: 'text-[#F59E0B] bg-[#F59E0B]/10',
    error: 'text-[#EF4444] bg-[#EF4444]/10'
  };

  const statusIcons = {
    success: 'CheckCircle2',
    warning: 'AlertTriangle',
    error: 'XCircle'
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${statusColors[status]}`}>
          <Icon name={icon} size={24} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusColors[status]}`}>
          <Icon name={statusIcons[status]} size={14} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-foreground">{value}</span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground">Цель: {target}</p>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <Icon name={trend > 0 ? "TrendingUp" : "TrendingDown"} size={14} className={trend > 0 ? "text-[#10B981]" : "text-[#EF4444]"} />
            <span className={`text-xs ${trend > 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
              {Math.abs(trend)}% за неделю
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

const Index = () => {
  const [period, setPeriod] = useState("week");

  const kpiData = [
    { title: "Среднее время разгрузки", value: "12.5", unit: "мин/пал", target: "< 15 мин", status: 'success' as const, icon: "Truck", trend: -5 },
    { title: "Расхождения", value: "2.3", unit: "%", target: "< 1.5%", status: 'error' as const, icon: "AlertCircle", trend: 15 },
    { title: "Простой у ворот", value: "22", unit: "мин", target: "< 20 мин", status: 'warning' as const, icon: "Clock", trend: 8 },
    { title: "Выполнение плана", value: "98.7", unit: "%", target: "> 95%", status: 'success' as const, icon: "TrendingUp", trend: 2 }
  ];

  const delayReasons = [
    { reason: "Ожидание документов", percent: 45, color: "#2563EB" },
    { reason: "Занятость доков", percent: 30, color: "#8B5CF6" },
    { reason: "Ожидание приемки", percent: 15, color: "#F59E0B" },
    { reason: "Технические неисправности", percent: 7, color: "#EF4444" },
    { reason: "Прочее", percent: 3, color: "#64748B" }
  ];

  const suppliers = [
    { name: "ООО Вега", shipments: 24, errors: 8.5, issue: "Недовоз" },
    { name: "ИП Сириус", shipments: 18, errors: 6.2, issue: "Несоответствие номенклатуры" },
    { name: "АО Полярис", shipments: 32, errors: 4.8, issue: "Брак упаковки" },
    { name: "ООО Альфа Логистик", shipments: 15, errors: 3.9, issue: "Перевоз" },
    { name: "ТД Орион", shipments: 21, errors: 2.1, issue: "Недовоз" }
  ];

  const errorTypes = [
    { type: "Недовоз", count: 45, color: "#EF4444" },
    { type: "Перевоз", count: 12, color: "#F59E0B" },
    { type: "Несоответствие номенклатуры", count: 28, color: "#8B5CF6" },
    { type: "Брак упаковки", count: 18, color: "#2563EB" },
    { type: "Брак товара", count: 9, color: "#64748B" }
  ];

  const delayPieData = delayReasons.map(item => ({
    label: item.reason,
    value: item.percent,
    color: item.color
  }));

  const errorPieData = errorTypes.map(item => ({
    label: item.type,
    value: item.count,
    color: item.color
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Мониторинг приемки груза</h1>
            <p className="text-sm text-muted-foreground mt-1">Контроллинг процесса приемки на складе</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Сегодня</SelectItem>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Icon name="RefreshCw" size={18} />
            </Button>
            <Button variant="outline" size="icon">
              <Icon name="Download" size={18} />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChart 
            data={delayPieData} 
            title="Причины простоев" 
            icon="Clock"
          />
          <PieChart 
            data={errorPieData} 
            title="Распределение ошибок" 
            icon="AlertTriangle"
          />
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Рейтинг поставщиков по качеству</h3>
            <Icon name="Star" size={20} className="text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Поставщик</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Поставки</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">% ошибок</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Основная проблема</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          supplier.errors > 6 ? 'bg-[#EF4444]/10 text-[#EF4444]' : 
                          supplier.errors > 4 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 
                          'bg-[#10B981]/10 text-[#10B981]'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-foreground">{supplier.shipments}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`text-sm font-semibold ${
                          supplier.errors > 6 ? 'text-[#EF4444]' : 
                          supplier.errors > 4 ? 'text-[#F59E0B]' : 
                          'text-[#10B981]'
                        }`}>
                          {supplier.errors}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm px-3 py-1 bg-gray-100 rounded-full text-muted-foreground">
                        {supplier.issue}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#2563EB]/5 to-[#8B5CF6]/5 border-[#2563EB]/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#2563EB]/10 rounded-xl">
              <Icon name="Lightbulb" size={24} className="text-[#2563EB]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-3">Рекомендации и выводы</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-foreground">
                  <Icon name="ArrowRight" size={16} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <span>За отчетный период основной рост процента расхождений (+2.1%) связан с поставщиком "ООО Вега" из-за частых недовозов. Рекомендуется провести совместную встречу.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground">
                  <Icon name="ArrowRight" size={16} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <span>Главная причина простоя — ожидание документов (45%). Проработать с отделом закупок процедуру предварительной электронной подачи документов.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground">
                  <Icon name="ArrowRight" size={16} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <span>Среднее время разгрузки улучшилось на 5% за неделю. Продолжить оптимизацию процесса работы с паллетами.</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <footer className="text-center text-sm text-muted-foreground py-4">
          <p>Последнее обновление: 15.10.2025 13:30 | Ответственный: Начальник склада</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;