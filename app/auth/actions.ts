'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const NEMOCLAW_URL = process.env.NEMOCLAW_API_URL || 'http://terminia-api:3100'

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const accountType = (formData.get('accountType') as string) || 'company'

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('fullName') as string,
        account_type: accountType,
        company_name: (formData.get('companyName') as string) || undefined,
        vat_number: (formData.get('vatNumber') as string) || undefined,
        sector: formData.get('sector') as string,
        size: formData.get('size') as string,
        city: formData.get('city') as string,
        fiscal_code: (formData.get('fiscalCode') as string) || undefined,
        personal_contract_profile: (formData.get('personalContractProfile') as string) || undefined,
      },
    },
  }

  const { data: signUpData, error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // Store signup document in Supabase storage (fire-and-forget)
  const documentBase64 = formData.get('documentBase64') as string
  const documentContentType = formData.get('documentContentType') as string
  const documentFilename = formData.get('documentFilename') as string
  if (documentBase64 && signUpData?.user?.id) {
    try {
      await fetch(`${NEMOCLAW_URL}/api/documents/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_base64: documentBase64,
          content_type: documentContentType || 'application/pdf',
          filename: documentFilename || 'registration-document.pdf',
          user_id: signUpData.user.id,
          source: 'registration',
        }),
      })
    } catch {
      // Non-fatal — signup succeeded, document storage is best-effort
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
