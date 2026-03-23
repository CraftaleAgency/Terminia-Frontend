'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
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
