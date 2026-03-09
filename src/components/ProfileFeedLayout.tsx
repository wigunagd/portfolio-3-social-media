import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

export function ProfileFeedLayout({ imageUrl }: { imageUrl: string }) {
    return (
        <AspectRatio ratio={1 / 1} className="w-full overflow-hidden rounded-md">
            <Image
                id="image-post"
                src={imageUrl}
                alt={`image feed`}
                fill
                className="object-cover transition-transform rounded-md" />
        </AspectRatio>
    )
}