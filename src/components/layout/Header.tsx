import { Link, useNavigate } from 'react-router-dom';
import { FileText, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/store/ResumeContext';

export default function Header() {
  const { resetData } = useResume();
  const navigate = useNavigate();

  const handleReset = () => {
    if (confirm('Reset all resume data? This cannot be undone.')) {
      resetData();
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors">
          <FileText className="w-5 h-5 text-primary" />
          <span>Resume Builder</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button size="sm" asChild>
            <Link to="/create">Edit Resume</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
