// Este é o nosso "intermediário" (api/eventos.js)
// Ele roda no servidor do Vercel, não no navegador.

export default async function handler(request, response) {
  
  // 1. Pega a nossa chave secreta do "cofre" (Passo 1)
  const apiKey = process.env.TICKETMASTER_API_KEY;

  // 2. Monta a URL da API do Ticketmaster
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=BR&city=São Paulo&apikey=${apiKey}&size=6&sort=date,asc&classificationName=Music,Arts & Theatre`;

  try {
    // 3. Chama o Ticketmaster (do servidor, onde é permitido e seguro)
    const ticketmasterResponse = await fetch(url);

    // Se o Ticketmaster falhar, avisa o nosso site
    if (!ticketmasterResponse.ok) {
      return response.status(ticketmasterResponse.status).json({ error: 'Falha ao buscar dados do Ticketmaster' });
    }
    
    // 4. Pega os dados que o Ticketmaster mandou
    const data = await ticketmasterResponse.json();
    
    // 5. Manda os dados de volta para o seu site (index.html)
    // ESTA LINHA É IMPORTANTE: Ela "libera" o CORS para o seu próprio site
    response.setHeader('Access-Control-Allow-Origin', '*'); // Permite que qualquer site chame (pode restringir depois)
    response.status(200).json(data);
    
  } catch (error) {
    // Se o nosso intermediário falhar
    response.status(500).json({ error: 'Erro interno no servidor' });
  }
}