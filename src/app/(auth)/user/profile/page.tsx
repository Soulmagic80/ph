"use client"

import ProfileForm from "@/components/profile/ProfileForm"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileServices from "@/components/profile/ProfileServices"
import ProfileStack from "@/components/profile/ProfileStack"
import { Divider } from "@/components/ui/Divider"
import { useAutoSave } from "@/hooks/portfolio/useAutoSave"
import { createClient } from "@/lib/supabase"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

interface Tool {
  id: string
  name: string
  category: string
}

interface Service {
  id: string
  name: string
  category: string
}

interface ProfileData {
  fullName: string
  location: string
  website: string
  bio: string
  avatarUrl?: string
  username?: string
  email?: string
  isAdmin?: boolean
  selectedTools: Tool[]
  selectedServices: Service[]
}

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    location: "",
    website: "",
    bio: "",
    avatarUrl: "",
    isAdmin: false,
    selectedTools: [],
    selectedServices: []
  })

  const [availableTools, setAvailableTools] = useState<Tool[]>([])
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Use useMemo to create a stable supabase client reference
  const supabase = useMemo(() => createClient(), [])

  // Auto-save hook for profile data
  const { triggerSave } = useAutoSave({
    debounceMs: 2000, // 2 seconds - good balance between responsiveness and efficiency
    savingText: 'Saving changes...',
    savedText: 'Changes saved',
    errorText: 'Failed to save changes',
    onSave: async (allData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')


      // Save profile data - merge auto-save data with current state
      const { error: profileError } = await (supabase
        .from('profiles') as any)
        .upsert({
          id: user.id,
          full_name: allData.fullName ?? profileData.fullName,
          location: allData.location ?? profileData.location,
          website: allData.website ? `https://${allData.website.trim()}` : (profileData.website ? `https://${profileData.website.replace(/^https?:\/\//, '').trim()}` : null),
          bio: allData.bio ?? profileData.bio,
          avatar_url: allData.avatarUrl ?? profileData.avatarUrl,
          username: profileData.username,
          email: profileData.email,
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        throw new Error(`Failed to save profile: ${profileError.message}`)
      }

      // Save tools
      await supabase.from('user_tools').delete().eq('user_id', user.id)
      if (profileData.selectedTools.length > 0) {
        const toolInserts = profileData.selectedTools.map(tool => ({
          user_id: user.id,
          tool_id: tool.id
        }))
        const { error: toolsError } = await (supabase.from('user_tools') as any).insert(toolInserts)
        if (toolsError) {
          throw new Error(`Failed to save tools: ${toolsError.message}`)
        }
      }

      // Save services
      await supabase.from('user_services').delete().eq('user_id', user.id)
      if (profileData.selectedServices.length > 0) {
        const serviceInserts = profileData.selectedServices.map(service => ({
          user_id: user.id,
          service_id: service.id
        }))
        const { error: servicesError } = await (supabase.from('user_services') as any).insert(serviceInserts)
        if (servicesError) {
          throw new Error(`Failed to save services: ${servicesError.message}`)
        }
      }

      setHasUnsavedChanges(false)
    }
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch available tools and services
        const [toolsResponse, servicesResponse] = await Promise.all([
          supabase.from('tools').select('*').order('name'),
          supabase.from('services').select('*').order('name')
        ])

        console.log('Tools response:', toolsResponse)
        console.log('Services response:', servicesResponse)

        if (toolsResponse.data) {
          console.log('Available tools:', toolsResponse.data)
          const typedTools: Tool[] = toolsResponse.data.map((tool: any) => ({
            id: tool.id,
            name: tool.name,
            category: tool.category
          }))
          setAvailableTools(typedTools)
        }
        if (servicesResponse.data) {
          console.log('Available services:', servicesResponse.data)
          const typedServices: Service[] = servicesResponse.data.map((service: any) => ({
            id: service.id,
            name: service.name,
            category: service.category
          }))
          setAvailableServices(typedServices)
        }

        // Fetch user profile data
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profile) {
            // Fetch user's selected tools
            const { data: userTools } = await supabase
              .from('user_tools')
              .select('tool_id, tool_name, tool_category')
              .eq('user_id', user.id)

            // Fetch user's selected services
            const { data: userServices } = await supabase
              .from('user_services')
              .select('service_id, service_name, service_category')
              .eq('user_id', user.id)

            setProfileData({
              fullName: (profile.full_name as string) || "",
              location: (profile.location as string) || "",
              website: (profile.website as string) || "",
              bio: (profile.bio as string) || "",
              avatarUrl: (profile.avatar_url as string) || "",
              username: (profile.username as string) || "",
              email: (profile.email as string) || "",
              isAdmin: (profile.is_admin as boolean) || false,
              selectedTools: userTools?.map((ut: any) => ({
                id: ut.tool_id,
                name: ut.tool_name,
                category: ut.tool_category
              })) || [],
              selectedServices: userServices?.map((us: any) => ({
                id: us.service_id,
                name: us.service_name,
                category: us.service_category
              })) || [],

            })
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  // Track unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    // Listen for browser back/forward
    const handlePopState = () => {
      if (hasUnsavedChanges) {
        // Prevent navigation by pushing current route back
        window.history.pushState(null, '', window.location.pathname)

        // Show warning toast with action buttons
        toast.warning('Unsaved changes! Scroll down to save.', {
          action: {
            label: 'Leave anyway',
            onClick: () => {
              setHasUnsavedChanges(false)
              window.history.back()
            }
          },
          cancel: {
            label: 'Cancel',
            onClick: () => {
              // Stay on current page
            }
          },
          duration: 10000
        })
      }
    }

    // Custom navigation interceptor for Next.js App Router
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link && hasUnsavedChanges) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/') && !href.startsWith('#')) {
          // Prevent navigation
          e.preventDefault()
          e.stopPropagation()

          // Show warning toast with action buttons
          toast.warning('Unsaved changes! Scroll down to save.', {
            action: {
              label: 'Leave anyway',
              onClick: () => {
                setHasUnsavedChanges(false)
                window.location.href = href
              }
            },
            cancel: {
              label: 'Cancel',
              onClick: () => {
                // Stay on current page
              }
            },
            duration: 10000
          })

          return false
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    document.addEventListener('click', handleClick, true)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleClick, true)
    }
  }, [hasUnsavedChanges])


  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <ProfileHeader
        fullName={profileData.fullName}
        location={profileData.location}
        avatarUrl={profileData.avatarUrl}
        onFullNameChange={(fullName) => {
          setProfileData(prev => ({ ...prev, fullName }))
          setHasUnsavedChanges(true)
          triggerSave({ fullName })
        }}
        onLocationChange={(location) => {
          setProfileData(prev => ({ ...prev, location }))
          setHasUnsavedChanges(true)
          triggerSave({ location })
        }}
        onAvatarChange={(avatarUrl) => {
          setProfileData(prev => ({ ...prev, avatarUrl }))
          setHasUnsavedChanges(true)
          triggerSave({ avatarUrl })
        }}
      />

      <Divider />

      <ProfileForm
        website={profileData.website}
        bio={profileData.bio}
        onWebsiteChange={(website) => {
          setProfileData(prev => ({ ...prev, website }))
          setHasUnsavedChanges(true)
          triggerSave({ website })
        }}
        onBioChange={(bio) => {
          setProfileData(prev => ({ ...prev, bio }))
          setHasUnsavedChanges(true)
          triggerSave({ bio })
        }}
      />

      <Divider />

      <ProfileStack
        selectedTools={profileData.selectedTools}
        availableTools={availableTools}
        onToolsChange={(selectedTools) => {
          setProfileData(prev => ({ ...prev, selectedTools }))
          setHasUnsavedChanges(true)
          triggerSave({ tools: selectedTools })
        }}
      />

      <Divider />

      <ProfileServices
        selectedServices={profileData.selectedServices}
        availableServices={availableServices}
        onServicesChange={(selectedServices) => {
          setProfileData(prev => ({ ...prev, selectedServices }))
          setHasUnsavedChanges(true)
          triggerSave({ services: selectedServices })
        }}
      />


    </div>
  )
}
