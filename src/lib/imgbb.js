const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export async function uploadImage(file) {
  if (!IMGBB_KEY) return null;
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  return data?.data?.url || null;
}

export function hasImgBB() {
  return !!IMGBB_KEY;
}
