import Link from 'next/link';
import Image from 'next/image';

export default function AdminFooter() {
  return (
    <footer className="w-full mt-auto border-t border-gray-200">
      <div className="bg-brand-secondary py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-white tracking-wide">
            Made By MRA Softec Private Limited
          </p>
        </div>
      </div>

    </footer>
  );
}