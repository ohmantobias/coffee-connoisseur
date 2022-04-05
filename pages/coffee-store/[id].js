import { useRouter } from "next/router";
import Link from "next/link";

const CoffeStore = () => {
  const router = useRouter();
  return (
    <div>
      <Link href="/">
        <a>Back to home</a>
      </Link>
    </div>
  );
};

export default CoffeStore;
