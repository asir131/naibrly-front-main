'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="w-full py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Main Heading */}
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Join as a Provider
          </h1>

          {/* Description Text */}
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            You have problems with leaking pipes, broken tiles, lost keys or want
            to tidy up the trees around you, of course you need our help!
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              size="lg"
              className="bg-[#0E7A60] hover:bg-emerald-700 text-white font-semibold px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/our-services">Explore more service</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}