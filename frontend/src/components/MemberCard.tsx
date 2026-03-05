import { type Member } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Calendar } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick: () => void;
}

export default function MemberCard({ member, onClick }: MemberCardProps) {
  const profileImageUrl = member.profilePhoto?.getDirectURL() || '/assets/generated/default-avatar.dim_128x128.png';
  const joiningDate = new Date(Number(member.joiningDate) / 1000000);

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profileImageUrl} alt={member.name} />
            <AvatarFallback className="text-lg">{member.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{member.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Phone className="h-3 w-3" />
              <span>{member.mobile}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3 w-3" />
              <span>{joiningDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
