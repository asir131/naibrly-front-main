"use client";
import { MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import clean from "@/public/clean.png";

export default function ServiceCard() {
  return (
    <div className=" w-full bg-gray-50 py-[50px] px-[340px]">
      <div className="  max-w-6x1 mx-auto ">
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <img
                src={clean.src}
                alt="Service Image"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className=" text-[18px] front-bold mb-2">
                Appliance Repairs
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-teal-600 font-semibold text-[15.75px]">
                  Exceptional 5.0
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-teal-600 text-teal-600"
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">(11)</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9999 13.4295C13.723 13.4295 15.1199 12.0326 15.1199 10.3095C15.1199 8.58633 13.723 7.18945 11.9999 7.18945C10.2768 7.18945 8.87988 8.58633 8.87988 10.3095C8.87988 12.0326 10.2768 13.4295 11.9999 13.4295Z"
                    stroke="#0E7A60"
                    stroke-width="1.5"
                  />
                  <path
                    d="M3.6202 8.49C5.5902 -0.169998 18.4202 -0.159997 20.3802 8.5C21.5302 13.58 18.3702 17.88 15.6002 20.54C13.5902 22.48 10.4102 22.48 8.3902 20.54C5.6302 17.88 2.4702 13.57 3.6202 8.49Z"
                    stroke="#0E7A60"
                    stroke-width="1.5"
                  />
                </svg>
                <span className="text-[#666] text-[16px] mb-2">
                  Street Springfield, IL 62704
                </span>
              </div>
              <div>
                <span className="text-[#676D73] text-[15.75px]">
                    <h3>Plumbing Drain Repair, Plumbing Pipe Repair, Plumbing Pipe
                  Installation or</h3>
                  <h3>Replacement, Sink or Faucet Repair, Sink or
                  Faucet Installation or…</h3>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4 md:min-w-[180px]">
              <div className="text-right">
                <div className="text-xl font-semibold text-gray-900">$100 - $140</div>
                <div className="text-[18px] text-gray-500">Avg. Price</div>
              </div>
              <div className="py-6">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 transition-colors whitespace-nowrap">
                Nailbrly Now
              </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
