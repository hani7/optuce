export const DUMMY_MONTURES = Array.from({ length: 50 }, (_, i) => {
  const brands = ['Ray-Ban', 'Gucci', 'Oakley', 'Vogue', 'Prada', 'Tom Ford', 'Persol', 'Dior'];
  const categories = ['Solaire', 'Optique', 'Sport', 'Enfant'];
  const photos = [
    '/@fs/C:/Users/pc/.gemini/antigravity/brain/4166786c-3de8-4b3b-9285-89323f3a2878/monture_aviator_1782773772603.png',
    '/@fs/C:/Users/pc/.gemini/antigravity/brain/4166786c-3de8-4b3b-9285-89323f3a2878/monture_gucci_1782773780227.png',
    '/@fs/C:/Users/pc/.gemini/antigravity/brain/4166786c-3de8-4b3b-9285-89323f3a2878/monture_oakley_1782773788422.png',
    '/@fs/C:/Users/pc/.gemini/antigravity/brain/4166786c-3de8-4b3b-9285-89323f3a2878/monture_enfant_1782773797172.png'
  ];

  const brand = brands[Math.floor(Math.random() * brands.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Assign photo based on category to make it somewhat realistic
  let photo = photos[0];
  if (category === 'Optique') photo = photos[1];
  if (category === 'Sport') photo = photos[2];
  if (category === 'Enfant') photo = photos[3];

  const price = Math.floor(Math.random() * (50000 - 8000 + 1) + 8000);
  // Round to nearest 500
  const roundedPrice = Math.round(price / 500) * 500;

  return {
    id: 9000 + i,
    reference: `REF-${1000 + i}`,
    marque: brand,
    modele: `Modèle ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 99)}`,
    designation: `${brand} - ${category} ${i+1}`,
    categorie: category,
    categorie_nom: category,
    prix: `${roundedPrice.toLocaleString('fr-FR')} DZD`,
    prix_vente: roundedPrice,
    stock: Math.floor(Math.random() * 20),
    type: 'monture',
    photo: photo
  };
});

export const DUMMY_VERRES = Array.from({ length: 40 }, (_, i) => {
  const brands = ['Essilor', 'Zeiss', 'Hoya', 'Rodenstock', 'Seiko'];
  const categories = ['Unifocal', 'Progressif', 'Bifocal', 'Dégressif'];
  const photos = [
    '/@fs/C:/Users/pc/.gemini/antigravity/brain/4166786c-3de8-4b3b-9285-89323f3a2878/verre_essilor_1782773803878.png',
    '/@fs/C:/Users/pc/.gemini/antigravity/brain/4166786c-3de8-4b3b-9285-89323f3a2878/verre_zeiss_1782773812597.png'
  ];

  const brand = brands[Math.floor(Math.random() * brands.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  let photo = photos[0];
  if (category === 'Progressif' || category === 'Dégressif') photo = photos[1];

  const price = Math.floor(Math.random() * (35000 - 4000 + 1) + 4000);
  const roundedPrice = Math.round(price / 500) * 500;

  return {
    id: 9500 + i,
    reference: `VR-${2000 + i}`,
    marque: brand,
    modele: `${category} Anti-reflet`,
    designation: `${brand} ${category} ${i+1}`,
    categorie: category,
    categorie_nom: category,
    prix: `${roundedPrice.toLocaleString('fr-FR')} DZD`,
    prix_vente: roundedPrice,
    stock: Math.floor(Math.random() * 50),
    type: 'verre_od',
    photo: photo
  };
});

export const DUMMY_CLIENTS = Array.from({ length: 25 }, (_, i) => {
  const noms = ['Benali', 'Saidi', 'Brahimi', 'Kaddour', 'Mansouri', 'Cherif', 'Haddad', 'Ziani'];
  const prenoms = ['Amine', 'Yacine', 'Sarah', 'Meriem', 'Karim', 'Nadia', 'Tarik', 'Lina'];
  
  const nom = noms[Math.floor(Math.random() * noms.length)];
  const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
  
  // Random date of birth between 1950 and 2015
  const start = new Date(1950, 0, 1).getTime();
  const end = new Date(2015, 0, 1).getTime();
  const dob = new Date(start + Math.random() * (end - start));
  
  const phone = `0${Math.floor(500000000 + Math.random() * 299999999)}`;

  return {
    id: 8000 + i,
    nom: nom,
    prenom: prenom,
    nom_complet: `${prenom} ${nom}`,
    telephone: phone,
    date_naissance: dob.toISOString().split('T')[0]
  };
});
