export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-4 h-4 rounded-full bg-primary absolute top-0 left-0 animate-ping" style={{ animationDelay: "0ms" }}></div>
          <div className="w-4 h-4 rounded-full bg-primary absolute top-0 right-0 animate-ping" style={{ animationDelay: "300ms" }}></div>
          <div className="w-4 h-4 rounded-full bg-primary absolute bottom-0 left-0 animate-ping" style={{ animationDelay: "600ms" }}></div>
          <div className="w-4 h-4 rounded-full bg-primary absolute bottom-0 right-0 animate-ping" style={{ animationDelay: "900ms" }}></div>
        </div>
      </div>
    </div>
  );
}
