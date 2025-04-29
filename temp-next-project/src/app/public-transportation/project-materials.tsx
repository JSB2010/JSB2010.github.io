"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectMaterials() {
  return (
    <Tabs defaultValue="research" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="research">Research Paper</TabsTrigger>
        <TabsTrigger value="action">Action Piece</TabsTrigger>
        <TabsTrigger value="final">Final Presentation</TabsTrigger>
      </TabsList>
      <TabsContent value="research" className="border rounded-lg p-4">
        <div className="aspect-video w-full">
          <iframe 
            src="https://docs.google.com/document/d/e/2PACX-1vQlbGwHq8AUTKXV0h2dKypdXnucepaBRKKXizWur2H7pe-hf_Zejf5w2hrJfIoN4fP4db9ENy6qHqYM/pub?embedded=true" 
            title="Research Paper on Public Transportation"
            className="w-full h-[600px] border-0"
          ></iframe>
        </div>
      </TabsContent>
      <TabsContent value="action" className="border rounded-lg p-4">
        <div className="aspect-video w-full">
          <iframe 
            src="https://1drv.ms/p/s!Av-6eo6o9gE9gYlXpXRUGVHd2TjNEA?embed=1&amp;em=2&amp;wdAr=1.7777777777777777" 
            title="Action Piece Presentation"
            className="w-full h-[600px] border-0"
          ></iframe>
        </div>
      </TabsContent>
      <TabsContent value="final" className="border rounded-lg p-4">
        <div className="aspect-video w-full">
          <iframe 
            src="https://1drv.ms/p/s!Av-6eo6o9gE9gYpXE1OVwenzG1vWJw?embed=1&amp;em=2&amp;wdAr=1.7777777777777777" 
            title="Final Presentation on Public Transportation"
            className="w-full h-[600px] border-0"
          ></iframe>
        </div>
      </TabsContent>
    </Tabs>
  );
}
