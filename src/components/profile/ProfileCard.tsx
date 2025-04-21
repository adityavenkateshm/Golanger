import { Profile } from '@/lib/services/profiles'
import Link from 'next/link'

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link 
      href={`/profiles/${profile.user_id}`}
      className="block p-6 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
    >
      <div>
        <h3 className="text-xl font-semibold">{profile.full_name}</h3>
        <p className="text-gray-400 mb-4">{profile.headline}</p>
      </div>

      {profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-sm"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 5 && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-sm">
              +{profile.skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
        <div>
          <span>Location: </span>
          {profile.location || 'Not specified'}
        </div>
        {profile.experience_years && (
          <div>
            <span>Experience: </span>
            {profile.experience_years} years
          </div>
        )}
        {profile.golang_experience && (
          <div>
            <span>Go Level: </span>
            {profile.golang_experience}
          </div>
        )}
      </div>
    </Link>
  )
}