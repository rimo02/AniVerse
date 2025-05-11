'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { Sparkles, SearchIcon, X, Menu } from 'lucide-react'
import Link from 'next/link'
import { Input } from './ui/input'
import ToggleTheme from './toggle-theme'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { DropdownMenuContent, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const navLinks = [
    { name: 'Discover', path: '/' },
    { name: 'Random', path: '/random' },
    { name: 'Favorites', path: '/favorites' },
    // { name: 'Mangas', path: '/mangas' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className={cn(
      "fixed top-0 w-full transition-all duration-200 flex justify-between border-b-1 z-50",
      isScrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className='p-4 flex w-[50%] items-center'>
        <div className='md:hidden flex items-center px-4'>
          <button className='p-2' onClick={() => setMenuOpen(prev => !prev)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className='flex gap-10 mr-5'>
          <div className='gap-1 flex items-center'>
            <Sparkles />
            <Link href={`/`}>AniVerse</Link>
          </div>
          <div className='hidden md:flex md:gap-10'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === link.path ? 'font-bold text-primary' : 'text-muted-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className='hidden md:flex gap-2 py-3 px-10 items-center'>
        <form onSubmit={handleSubmit}>
          <div className='flex'>
            <SearchIcon className='h-8 w-5 mt-0.5 left-8 relative' />
            <Input
              placeholder='Search...'
              className='w-100 pl-11'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <ToggleTheme />
        {session ? (
          <div className='flex gap-4 items-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='relative w-8 h-8 rounded-full overflow-hidden cursor-pointer'>
                  <Image
                    src={session.user?.image as string}
                    alt='User image'
                    fill
                    className='object-cover'
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='start'>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <button onClick={() => signIn("google")} className='hover:text-primary cursor-pointer'>
            Sign In
          </button>
        )}
      </div>

      <div className='md:hidden flex items-center px-4'>
        <ToggleTheme />
        {session ? (
          <div className='flex gap-4 items-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='relative w-8 h-8 rounded-full overflow-hidden cursor-pointer'>
                  <Image
                    src={session.user?.image as string}
                    alt='User image'
                    fill
                    className='object-cover'
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='start'>
                {/* <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <button onClick={() => signIn("google")}>
            Sign In
          </button>
        )}
      </div>

      {menuOpen && (
        <div className='md:hidden absolute flex flex-col w-full left-0 bg-background shadow-md z-50 top-full p-4 gap-4'>
          <form onSubmit={handleSubmit}>
            <div className='flex'>
              <SearchIcon className='h-8 w-5 mt-0.5 relative left-6' />
              <Input
                placeholder='Search...'
                className='w-full pl-10'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.path ? 'font-semibold text-primary underline' : 'text-muted-foreground'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar
