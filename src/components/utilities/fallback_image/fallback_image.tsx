import React from "react";
import Image from "next/image";

type Props = {
  picture: string | null;
  seed: string;
  size: number;
};

const FallbackImage: React.FC<Props> = ({ picture, seed, size }) => {
  if (!picture || picture.length === 0)
    picture = `https://avatars.dicebear.com/api/initials/${seed}.svg`;

  return <Image src={picture} alt={seed} width={size} height={size} />;
};

export default FallbackImage;
