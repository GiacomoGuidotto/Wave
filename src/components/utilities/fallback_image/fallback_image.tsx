import React from "react";
import Image from "next/image";

type Props = {
  picture: string | null;
  seed: string;
  size: number;
};

const FallbackImage: React.FC<Props> = ({ picture, seed, size }) => {
  return (
    <Image
      src={picture ?? `https://avatars.dicebear.com/api/initials/${seed}.svg`}
      alt={seed}
      width={size}
      height={size}
    />
  );
};

export default FallbackImage;
