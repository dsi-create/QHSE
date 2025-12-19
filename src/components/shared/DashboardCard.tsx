import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  iconName: string;
  colorClass: string;
  onClick?: () => void;
}

export const DashboardCard = ({ title, value, iconName, colorClass, onClick }: DashboardCardProps) => {
  const isClickable = !!onClick;
  const CardComponent = isClickable ? 'button' : 'div';

  return (
    <Card className={cn(
      "card-hover border-2 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300",
      isClickable ? "cursor-pointer hover:scale-105 active:scale-95" : ""
    )}>
      <CardComponent onClick={onClick} className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">
                {title}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                {value}
              </p>
            </div>
            <div className={cn(
              "p-3 md:p-4 rounded-xl shadow-lg",
              colorClass,
              "transition-transform duration-300 hover:scale-110"
            )}>
              <Icon name={iconName} className="text-xl md:text-2xl" />
            </div>
          </div>
          {isClickable && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 flex items-center">
                Cliquer pour voir <Icon name="ArrowRight" className="ml-1 h-3 w-3" />
              </span>
            </div>
          )}
        </CardContent>
      </CardComponent>
    </Card>
  );
};