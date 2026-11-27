import { Button } from "@/components/ui/button"
import { useMintNFT } from "./useMintNFT"

export function MintButton({ className }: { className?: string }) {
  const { status, txHash, error, mint, reset } = useMintNFT()

  if (status === "success" && txHash) {
    return (
      <div className={className}>
        <p className="mb-2 text-sm text-emerald-400">Mint successful!</p>
        <a
          href={`https://sepolia.basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-zinc-400 underline hover:text-red-300"
        >
          View transaction
        </a>
        <Button size="sm" variant="outline" className="ml-3 rounded-full" onClick={reset}>
          Mint another
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <Button
        onClick={() => void mint()}
        disabled={status === "connecting" || status === "pending"}
        className="rounded-full"
      >
        {status === "connecting" && "Connecting wallet…"}
        {status === "pending" && "Confirm in wallet…"}
        {(status === "idle" || status === "error") && "Mint NFT (0.01 ETH)"}
      </Button>
      {error && (
        <p role="alert" className="mt-2 max-w-sm text-xs text-amber-300">
          {error}
        </p>
      )}
    </div>
  )
}

export default MintButton
