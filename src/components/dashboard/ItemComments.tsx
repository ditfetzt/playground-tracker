import { useState, useEffect, useRef, type FormEvent } from 'react'
import type { ItemComment, Profile } from '../../lib/types'
import { getMemberColor } from '../../lib/constants'
import { MessageSquare, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { canDeleteComment } from '../../lib/permissions'

interface ItemCommentsProps {
  itemId: string
  comments: ItemComment[]
  profiles: Profile[]
  currentProfile: Profile | null
  onAddComment: (itemId: string, content: string) => Promise<void>
  onDeleteComment: (commentId: string) => Promise<void>
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function getLastReadKey(itemId: string) {
  return `item_comments_read_${itemId}`
}

function getLastReadAt(itemId: string): string | null {
  return localStorage.getItem(getLastReadKey(itemId))
}

function setLastReadAt(itemId: string) {
  localStorage.setItem(getLastReadKey(itemId), new Date().toISOString())
}

function hasUnreadComments(itemId: string, comments: ItemComment[]): boolean {
  const lastRead = getLastReadAt(itemId)
  if (!lastRead) return comments.length > 0
  const lastReadTime = new Date(lastRead).getTime()
  return comments.some(c => new Date(c.created_at).getTime() > lastReadTime)
}

export function ItemComments({ itemId, comments, profiles, currentProfile, onAddComment, onDeleteComment }: ItemCommentsProps) {
  const [expanded, setExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const itemComments = comments.filter(c => c.item_id === itemId)
  const sortedComments = [...itemComments].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  const unread = hasUnreadComments(itemId, itemComments)

  // Update last read when expanded
  useEffect(() => {
    if (expanded && itemComments.length > 0) {
      setLastReadAt(itemId)
    }
  }, [expanded, itemComments.length, itemId])

  const handleToggle = () => {
    setExpanded(prev => !prev)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || !currentProfile) return
    setSending(true)
    await onAddComment(itemId, trimmed)
    setInputValue('')
    setSending(false)
    // Keep expanded and focus input
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const getProfile = (profileId: string) => {
    return profiles.find(p => p.id === profileId) || itemComments.find(c => c.profile_id === profileId)?.profile
  }

  if (itemComments.length === 0 && !currentProfile) {
    return null
  }

  return (
    <div className="mt-1">
      {/* Toggle button with count and unread dot */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${expanded ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <MessageSquare size={12} />
        <span>{itemComments.length}</span>
        {unread && !expanded && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        )}
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {/* Expanded thread */}
      {expanded && (
        <div className="mt-2 flex flex-col gap-2 pl-1">
          {sortedComments.map(comment => {
            const profile = getProfile(comment.profile_id)
            const color = getMemberColor(profile?.name || 'Unknown')
            const initials = profile?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??'
            const canDelete = currentProfile ? canDeleteComment(currentProfile, comment) : false

            return (
              <div key={comment.id} className="flex items-start gap-2 group">
                {/* Avatar */}
                <span
                  className="inline-flex items-center justify-center rounded-full font-bold text-[9px] shrink-0 mt-0.5"
                  style={{
                    width: 20, height: 20,
                    backgroundColor: color + '20',
                    color: color,
                    border: `1.5px solid ${color}40`,
                  }}
                >
                  {initials}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[12px] font-semibold text-foreground">{profile?.name || 'Unknown'}</span>
                    <span className="text-[11px] text-muted-foreground">{timeAgo(comment.created_at)}</span>
                    {canDelete && (
                      <button
                        onClick={() => { if (confirm('Delete this comment?')) onDeleteComment(comment.id) }}
                        className="ml-auto p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity"
                        title="Delete"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                  <p className="text-[12px] text-foreground/90 leading-relaxed break-words">{comment.content}</p>
                </div>
              </div>
            )
          })}

          {/* Add comment input */}
          {currentProfile && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Add a comment..."
                disabled={sending}
                className="flex-1 min-w-0 bg-secondary/30 border border-border rounded-lg px-2.5 py-1 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                type="submit"
                disabled={sending || !inputValue.trim()}
                className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
              >
                {sending ? '...' : 'Send'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
