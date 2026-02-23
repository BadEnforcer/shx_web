"use client"

import { useEffect } from "react"
import { getSession } from "next-auth/react"
import { useDispatch } from "react-redux"
import { setSession, setStatus, toAuthSession } from "@/lib/store/slices/authSlice"

export function AuthSync() {
  const dispatch = useDispatch()

  useEffect(() => {
    let mounted = true

    async function sync() {
      dispatch(setStatus("loading"))
      const session = await getSession()
      if (!mounted) return
      const authSession = toAuthSession(session)
      dispatch(setSession(authSession))
    }

    sync()

    function onFocus() {
      getSession().then((session) => {
        if (mounted) dispatch(setSession(toAuthSession(session)))
      })
    }
    window.addEventListener("focus", onFocus)
    return () => {
      mounted = false
      window.removeEventListener("focus", onFocus)
    }
  }, [dispatch])

  return null
}
