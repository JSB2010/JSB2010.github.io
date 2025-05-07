# Image Best Practices

This document outlines the best practices for handling images in the portfolio website.

## Image Optimization

### Why Optimize Images?

- **Performance**: Smaller images load faster, improving page speed and user experience
- **Bandwidth**: Reduces data usage for users on mobile networks
- **SEO**: Faster loading times improve search engine rankings
- **User Experience**: Faster loading times reduce bounce rates

### How to Optimize Images

1. **Use the optimization script**:

```bash
# Optimize all images in public/images
npm run optimize-all-images
```

This will create WebP versions of all images in the `public/images/optimized` directory.

2. **Use the OptimizedImage component**:

```tsx
import { OptimizedImage } from "@/components/ui/optimized-image";

// In your component:
<OptimizedImage
  src="/images/optimized/jacob-profile.webp"
  alt="Jacob Barkin"
  fill
  className="object-cover"
  priority={true}
/>
```

## Image Component Options

The `OptimizedImage` component supports the following options:

| Option | Description | Default |
|--------|-------------|---------|
| `src` | Image source path | Required |
| `alt` | Alternative text for accessibility | Required |
| `className` | CSS classes for the image | "" |
| `containerClassName` | CSS classes for the container div | "" |
| `fill` | Whether the image should fill its container | false |
| `width` | Image width (ignored if fill=true) | 800 |
| `height` | Image height (ignored if fill=true) | 600 |
| `priority` | Whether to prioritize loading this image | false |
| `quality` | Image quality (1-100) | 85 |
| `sizes` | Responsive size hints | "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" |

## Best Practices

1. **Use WebP format**: WebP offers better compression than JPEG or PNG
2. **Set appropriate sizes**: Specify the `sizes` attribute for responsive images
3. **Use priority for above-the-fold images**: Set `priority={true}` for images visible on initial load
4. **Provide meaningful alt text**: Always include descriptive alt text for accessibility
5. **Lazy load below-the-fold images**: Don't set priority for images not visible on initial load
6. **Use appropriate dimensions**: Don't load larger images than needed

## Troubleshooting

If you encounter issues with the Next.js Image component:

1. Try using the `unoptimized={true}` prop to bypass Next.js image optimization
2. Fall back to a standard HTML `<img>` tag if necessary
3. Check the browser console for any errors related to image loading

## Image Formats

| Format | Best for | Pros | Cons |
|--------|----------|------|------|
| WebP | Most images | Best compression, transparency | Not supported in older browsers |
| JPEG | Photos | Good compression | No transparency |
| PNG | Graphics | Lossless, transparency | Larger file size |
| SVG | Icons, logos | Scalable, tiny file size | Not suitable for photos |

## Resources

- [Next.js Image Documentation](https://nextjs.org/docs/api-reference/next/image)
- [WebP Browser Support](https://caniuse.com/webp)
- [Image Optimization Tools](https://web.dev/fast/#optimize-your-images)
