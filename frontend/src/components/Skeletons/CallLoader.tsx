import { Loader } from 'lucide-react';
const CallLoader = () => {
    return (
      <div className='flex items-center justify-center h-32 w-full'>
        <Loader className="size-6 text-cyan-500 animate-spin" />
      </div>
    );
}

export default CallLoader