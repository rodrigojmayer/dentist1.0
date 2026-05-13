import dotenv from "dotenv"

dotenv.config()

import { createAdminClient } from "../lib/supabase/admin"

const supabase = createAdminClient()

async function loadHolidays() {
  const year = new Date().getFullYear()

  const response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/AR`
  )

  const holidays = await response.json()

  const formatted = holidays.map((holiday: any) => ({
    date: holiday.date,
    name: holiday.localName,
  }))

  const { error } = await supabase
    .from("holidays")
    .upsert(formatted, {
      onConflict: "date",
    })

  if (error) {
    console.error(error)
    return
  }

  console.log("Feriados cargados correctamente")
}

loadHolidays()