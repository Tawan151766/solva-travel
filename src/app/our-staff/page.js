import { redirect } from 'next/navigation';

export default function OurStaffPage() {
  // Redirect to the main staff page since this might be an old route
  redirect('/staff');
}
