import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FORM_CONFIG } from "../constants/createOrder";

interface HelpCardProps {
  userRole: "USER" | "MANAGER" | undefined;
}

export function HelpCard({ userRole }: HelpCardProps) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm text-blue-800">
          Tips for Creating Work Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-blue-700">
        <ul className="list-disc list-inside space-y-1">
          {FORM_CONFIG.TIPS.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
          {userRole === "MANAGER" && (
            <li>
              You can assign orders immediately or leave them for later
              assignment
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
