import { Button } from "@/components/ui/button"
import { useMintNFT } from "./useMintNFT"

export function MintButton({
  tokenId,
  disabled,
  className,
}: {
  tokenId: number
  disabled?: boolean
  className?: string
}) {
  const { status, txHash, error, tokenId: activeId, mint, reset } = useMintNFT()
  const isThis = activeId === tokenId

  if (isThis && status === "success" && txHash) {
    return (
      <div className={className}>
        <p className="mb-2 text-sm text-emerald-400">Minted #{tokenId}!</p>
        <a
          href={`https://sepolia.basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-zinc-400 underline hover:text-red-300"
        >
          View transaction
        </a>
        <Button size="sm" variant="outline" className="ml-3 rounded-full" onClick={reset}>
          Done
        </Button>
      </div>
    )
  }

  const busy = isThis && (status === "connecting" || status === "pending")

  return (
    <div className={className}>
      <Button
        onClick={() => void mint(tokenId)}
        disabled={disabled || busy}
        className="rounded-full"
      >
        {busy && status === "connecting" && "Connecting…"}
        {busy && status === "pending" && "Confirm in wallet…"}
        {!busy && `Mint #${tokenId} · 0.01 ETH`}
      </Button>
      {isThis && error && (
        <p role="alert" className="mt-2 max-w-sm text-xs text-amber-300">
          {error}
        </p>
      )}
    </div>
  )
}

export default MintButton
