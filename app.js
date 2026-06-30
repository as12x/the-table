let config = window.TABLE_CONFIG || {};
let client = null;

const personas = {
  "rasta-bum": { id: "persona-rasta-bum", name: "Rasta Bum", handle: "rasta" },
  "pigeon-crumb": { id: "persona-pigeon-crumb", name: "Pigeon Crumb", handle: "pigeon" }
};

const discordMembers = [
  { name: "Xllth", status: "Invisible" },
  { name: "Pigeon Crumb", status: "Offline" },
  { name: "Rasta Bum", status: "Voice connected" }
];

const seededMessages = {
  general: [
    { author_name: "Pigeon Crumb", body: "like 2hrs away from brisbane", created_at: "2026-06-28T15:21:00+10:00" },
    { author_name: "Pigeon Crumb", body: "the first one doesnt look good but its like 65acres lol you can hide forever", created_at: "2026-06-28T15:21:30+10:00" },
    { author_name: "Rasta Bum", body: "yeah that 3rd one is nice but its just 1 plot right ?", created_at: "2026-06-28T15:21:45+10:00" },
    { author_name: "Rasta Bum", body: "not hte whole area ?", created_at: "2026-06-28T15:22:00+10:00" },
    { author_name: "Pigeon Crumb", body: "just x1 2acre plots", created_at: "2026-06-28T15:23:00+10:00" },
    { author_name: "Pigeon Crumb", body: "plot", created_at: "2026-06-28T15:23:20+10:00" },
    { author_name: "Rasta Bum", body: "if there a waterhole or anything big body of water makes even vbetter thats why i like option 2 a fair bit has it own water area.", created_at: "2026-06-28T15:24:00+10:00" },
    { author_name: "Pigeon Crumb", body: "https://x.com/aus_pill/status/2071157159979827653?s=20", created_at: "2026-06-28T19:22:00+10:00" },
    { author_name: "Pigeon Crumb", body: "this guy is so good at editing its great propaganda", created_at: "2026-06-28T19:23:00+10:00" },
    { author_name: "Pigeon Crumb", body: "highly valuable skill", created_at: "2026-06-28T19:23:20+10:00" },
    { author_name: "Rasta Bum", body: "Good video. thumbs up yeah", created_at: "2026-06-28T19:33:00+10:00" },
    { author_name: "Rasta Bum", body: "Captures the spirit nicely", created_at: "2026-06-28T19:33:20+10:00" },
    { author_name: "Pigeon Crumb", body: "@Rasta Bum https://x.com/javiiarchive/status/2071381213634347233?s=20", created_at: "2026-06-29T22:27:00+10:00" },
    { author_name: "Pigeon Crumb", body: "@Rasta Bum need faceless x accounts to troll and build up platform", created_at: "2026-06-29T22:27:30+10:00" }
  ],
  constitution: [
    {
      author_name: "Pigeon Crumb",
      body: "table signal archive",
      created_at: "2026-06-30T19:42:00+10:00",
      media_url: "./assets/constitution/table-signal.mp4",
      media_name: "table-signal.mp4"
    },
    {
      author_name: "Pigeon Crumb",
      body: "crumbs entry",
      created_at: "2026-06-30T19:43:00+10:00",
      media_url: "./assets/constitution/crumbs.mp4",
      media_name: "crumbs.mp4"
    },
    {
      author_name: "Pigeon Crumb",
      body: "crumbs continuation",
      created_at: "2026-06-30T19:44:00+10:00",
      media_url: "./assets/constitution/crumbs1.mp4",
      media_name: "crumbs1.mp4"
    },
    {
      author_name: "Rasta Bum",
      body: "crumbs field recording",
      created_at: "2026-06-30T19:45:00+10:00",
      media_url: "./assets/constitution/crumbs2.mp4",
      media_name: "crumbs2.mp4"
    },
    {
      author_name: "Rasta Bum",
      body: "My mother raised me as a kindest and the sweetest person meme",
      created_at: "2026-06-30T19:46:00+10:00",
      media_url: "./assets/constitution/kindest-sweetest.mp4",
      media_name: "kindest-sweetest.mp4"
    }
  ],
  hustlers: [],
  "tax-reaper": [],
  loans: [],
  "suits-tism": []
};

const state = {
  channel: "general",
  session: null,
  persona: null,
  messages: [],
  realtimeChannel: null,
  voiceRoom: null,
  voiceChannel: null,
  voicePresenceChannels: new Map(),
  voiceOccupants: new Map(),
  voiceStream: null,
  voiceMuted: false,
  voicePeers: new Map()
};

const channels = document.querySelectorAll(".channel");
const voiceChannels = document.querySelectorAll(".voice-channel");
const personaButtons = document.querySelectorAll(".persona-button");
const messagesEl = document.querySelector("#messages");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const authForm = document.querySelector("#authForm");
const authPanel = document.querySelector("#authPanel");
const authMessage = document.querySelector("#authMessage");
const channelTitle = document.querySelector("#channelTitle");
const connectionStatus = document.querySelector("#connectionStatus");
const userAvatar = document.querySelector("#userAvatar");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const signOutButton = document.querySelector("#signOutButton");
const inviteButton = document.querySelector("#inviteButton");
const membersList = document.querySelector("#membersList");
const memberCount = document.querySelector("#memberCount");
const messageTemplate = document.querySelector("#messageTemplate");
const videoPostTemplate = document.querySelector("#videoPostTemplate");
const themeVideo = document.querySelector("#themeVideo");
const voicePanel = document.querySelector("#voicePanel");
const voiceRoomName = document.querySelector("#voiceRoomName");
const voiceStatus = document.querySelector("#voiceStatus");
const muteButton = document.querySelector("#muteButton");
const leaveVoiceButton = document.querySelector("#leaveVoiceButton");
const remoteAudio = document.querySelector("#remoteAudio");

function initials(value) {
  return (value || "?")
    .split("@")[0]
    .split(/[.\s_-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";
}

function displayName(value) {
  return value && value.includes("@") ? value.split("@")[0] : value || "Guest";
}

function channelSeed() {
  return seededMessages[state.channel] || [];
}

function localMessageKey(channel = state.channel) {
  return `the-table:${channel}:messages`;
}

function loadLocalMessages() {
  try {
    return JSON.parse(localStorage.getItem(localMessageKey()) || "[]");
  } catch (_error) {
    return [];
  }
}

function saveLocalMessage(message) {
  const messages = [...loadLocalMessages(), message].slice(-100);
  localStorage.setItem(localMessageKey(), JSON.stringify(messages));
}

function currentIdentity() {
  if (state.session?.user) {
    return {
      id: state.session.user.id,
      name: displayName(state.session.user.email),
      handle: state.session.user.email,
      email: state.session.user.email,
      type: "supabase"
    };
  }

  if (state.persona) {
    return { ...state.persona, type: "persona" };
  }

  return null;
}

function setStatus(text, online = false) {
  connectionStatus.textContent = text;
  connectionStatus.classList.toggle("online", online);
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    if (response.ok) config = await response.json();
  } catch (_error) {
    config = window.TABLE_CONFIG || {};
  }

  const hasSupabaseConfig =
    config.SUPABASE_URL &&
    config.SUPABASE_ANON_KEY &&
    !config.SUPABASE_URL.includes("your-project") &&
    !config.SUPABASE_ANON_KEY.includes("your-public");

  client = hasSupabaseConfig
    ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
    : null;
}

function setUser(session) {
  state.session = session;
  const identity = currentIdentity();
  userAvatar.textContent = initials(identity?.name || "Guest");
  userName.textContent = identity?.name || "Guest";
  userEmail.textContent = identity?.handle || "Not signed in";
  authPanel.hidden = Boolean(identity);
  messageInput.disabled = !identity;
  messageInput.placeholder = identity ? `Message #${state.channel}` : "Choose a profile to send a message";
}

async function choosePersona(personaKey) {
  state.persona = personas[personaKey] || null;
  if (!state.persona) return;

  localStorage.setItem("the-table:persona", personaKey);
  if (client && state.session) await client.auth.signOut();
  setUser(null);
  renderMembers();
  await loadMessages();
  subscribeToMessages();
}

function setVoiceStatus(text) {
  voiceStatus.textContent = text;
}

function renderMembers() {
  const identity = currentIdentity();
  const members = [
    { name: "Rasta Bum", status: identity?.name === "Rasta Bum" ? "Online" : "Ready" },
    { name: "Pigeon Crumb", status: identity?.name === "Pigeon Crumb" ? "Online" : "Ready" }
  ];

  membersList.innerHTML = members
    .map(
      (member) => `
        <div class="member">
          <div class="avatar">${initials(member.name)}</div>
          <div>
            <strong>${member.name}</strong>
            <span>${member.status}</span>
          </div>
        </div>
      `
    )
    .join("");
  memberCount.textContent = identity ? "1 online" : "0 online";
}

function renderVoiceButtons() {
  voiceChannels.forEach((button) => {
    const room = button.dataset.voiceRoom;
    const occupants = state.voiceOccupants.get(room) || [];
    const names = occupants.map((person) => person.name).join(", ");
    const fallback = button.dataset.defaultStatus || "";
    let status = button.querySelector("small");

    if (!status) {
      status = document.createElement("small");
      button.appendChild(status);
    }

    status.textContent = names || fallback;
    button.classList.toggle("connected", room === state.voiceRoom);
    button.classList.toggle("occupied", occupants.length > 0);
  });
}

function renderMessages() {
  messagesEl.innerHTML = "";

  if (!state.messages.length) {
    messagesEl.innerHTML = `
      <div class="empty-state">
        <h3>#${state.channel}</h3>
        <p>No visible Discord messages were captured for this channel yet.</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();
  state.messages.forEach((message) => {
    const node = (message.media_url ? videoPostTemplate : messageTemplate).content.cloneNode(true);
    const author = message.author_name || message.author_email || "unknown";
    node.querySelector(".message-avatar").textContent = initials(author);
    node.querySelector(".message-author").textContent = displayName(author);
    node.querySelector(".message-time").textContent = new Date(message.created_at).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    node.querySelector(".message-body").textContent = message.body;
    const video = node.querySelector(".post-video");
    if (video) {
      video.src = message.media_url;
      video.title = message.media_name || message.body;
    }
    fragment.appendChild(node);
  });

  messagesEl.appendChild(fragment);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function updateTheme() {
  const constitutionMode = state.channel === "constitution";
  document.body.classList.add("signal-theme");
  document.body.classList.toggle("constitution-theme", constitutionMode);

  if (!themeVideo) return;
  themeVideo.play().catch(() => {});
}

async function loadMessages() {
  const localMessages = loadLocalMessages();

  if (!client) {
    state.messages = [...channelSeed(), ...localMessages];
    setStatus("Setup needed");
    renderMessages();
    return;
  }

  if (!state.session) {
    state.messages = [...channelSeed(), ...localMessages];
    renderMessages();
    setStatus("Ready");
    return;
  }

  const { data, error } = await client
    .from("messages")
    .select("*")
    .eq("channel", state.channel)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    setStatus("DB error");
    authMessage.textContent = error.message;
    return;
  }

  state.messages = [...channelSeed(), ...localMessages, ...(data || [])];
  renderMessages();
}

function subscribeToMessages() {
  if (!client) return;
  if (state.realtimeChannel) client.removeChannel(state.realtimeChannel);
  state.realtimeChannel = null;
  if (!currentIdentity()) return;

  state.realtimeChannel = client.channel(`messages:${state.channel}`);

  state.realtimeChannel.on("broadcast", { event: "persona-message" }, ({ payload }) => {
      if (payload.sender_id === currentIdentity()?.id) return;
      state.messages.push(payload.message);
      saveLocalMessage(payload.message);
      renderMessages();
    });

  if (state.session) {
    state.realtimeChannel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `channel=eq.${state.channel}` },
      (payload) => {
        state.messages.push(payload.new);
        renderMessages();
      }
    );
  }

  state.realtimeChannel.subscribe((status) => {
    setStatus(status === "SUBSCRIBED" ? "Online" : "Connecting", status === "SUBSCRIBED");
  });
}

async function sendMessage(body) {
  const identity = currentIdentity();
  if (!identity) return;

  if (identity.type === "persona") {
    const message = {
      author_name: identity.name,
      body,
      created_at: new Date().toISOString()
    };
    state.messages.push(message);
    saveLocalMessage(message);
    renderMessages();

    if (state.realtimeChannel) {
      await state.realtimeChannel.send({
        type: "broadcast",
        event: "persona-message",
        payload: { sender_id: identity.id, message }
      });
    }
    return;
  }

  if (!client || !state.session?.user?.email) return;

  const { error } = await client.from("messages").insert({
    channel: state.channel,
    body,
    author_id: state.session.user.id,
    author_email: state.session.user.email
  });

  if (error) authMessage.textContent = error.message;
}

function peerConfig() {
  return {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:global.stun.twilio.com:3478" }
    ]
  };
}

function userId() {
  return currentIdentity()?.id;
}

function userLabel() {
  return currentIdentity()?.name || "Guest";
}

async function sendVoiceSignal(to, type, data) {
  if (!state.voiceChannel) return;
  await state.voiceChannel.send({
    type: "broadcast",
    event: "voice-signal",
    payload: {
      from: userId(),
      fromName: userLabel(),
      to,
      type,
      data
    }
  });
}

function closePeer(peerId) {
  const peer = state.voicePeers.get(peerId);
  if (peer) peer.close();
  state.voicePeers.delete(peerId);
  const audio = document.querySelector(`[data-peer-audio="${peerId}"]`);
  if (audio) audio.remove();
}

function createPeer(peerId) {
  if (state.voicePeers.has(peerId)) return state.voicePeers.get(peerId);
  if (!state.voiceStream) throw new Error("Local audio is not ready");

  const peer = new RTCPeerConnection(peerConfig());
  state.voicePeers.set(peerId, peer);

  state.voiceStream.getTracks().forEach((track) => {
    peer.addTrack(track, state.voiceStream);
  });

  peer.onicecandidate = (event) => {
    if (event.candidate) sendVoiceSignal(peerId, "ice", event.candidate);
  };

  peer.ontrack = (event) => {
    let audio = document.querySelector(`[data-peer-audio="${peerId}"]`);
    if (!audio) {
      audio = document.createElement("audio");
      audio.autoplay = true;
      audio.playsInline = true;
      audio.dataset.peerAudio = peerId;
      remoteAudio.appendChild(audio);
    }
    audio.srcObject = event.streams[0];
  };

  peer.onconnectionstatechange = () => {
    if (["failed", "closed", "disconnected"].includes(peer.connectionState)) {
      closePeer(peerId);
    }
  };

  return peer;
}

async function callPeer(peerId) {
  await ensureVoiceStream();
  const peer = createPeer(peerId);
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  await sendVoiceSignal(peerId, "offer", offer);
}

async function handleVoiceSignal(payload) {
  if (!state.voiceRoom || payload.to !== userId() || payload.from === userId()) return;

  await ensureVoiceStream();
  const peer = createPeer(payload.from);

  if (payload.type === "offer") {
    await peer.setRemoteDescription(new RTCSessionDescription(payload.data));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    await sendVoiceSignal(payload.from, "answer", answer);
  }

  if (payload.type === "answer") {
    await peer.setRemoteDescription(new RTCSessionDescription(payload.data));
  }

  if (payload.type === "ice") {
    await peer.addIceCandidate(new RTCIceCandidate(payload.data));
  }
}

async function ensureVoiceStream() {
  if (state.voiceStream) return true;

  if (!navigator.mediaDevices?.getUserMedia) {
    authMessage.textContent = "This browser does not support voice chat.";
    return false;
  }

  setVoiceStatus("Starting microphone");

  try {
    state.voiceStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false
    });
    muteButton.disabled = false;
    return true;
  } catch (_error) {
    authMessage.textContent = "Allow microphone access to use voice.";
    setVoiceStatus("Microphone blocked");
    return false;
  }
}

function subscribeVoicePresence() {
  if (!client || state.voicePresenceChannels.size) return;

  voiceChannels.forEach((button) => {
    const room = button.dataset.voiceRoom;
    button.dataset.defaultStatus = button.querySelector("small")?.textContent || "";

    const channel = client.channel(`voice:${room}`, {
      config: {
        broadcast: { self: false },
        presence: { key: `observer-${room}` }
      }
    });

    channel
      .on("broadcast", { event: "voice-signal" }, ({ payload }) => {
        if (state.voiceRoom === room) handleVoiceSignal(payload);
      })
      .on("presence", { event: "sync" }, () => {
        const presence = channel.presenceState();
        const occupants = Object.entries(presence)
          .map(([_id, entries]) => entries?.[0])
          .filter((entry) => entry?.user_id)
          .map((entry) => ({
            id: entry.user_id,
            name: entry.name || "Unknown",
            muted: Boolean(entry.muted)
          }));

        state.voiceOccupants.set(room, occupants);
        renderVoiceButtons();

        if (state.voiceRoom === room) {
          handleRoomPresence(occupants.map((person) => person.id));
        }
      })
      .subscribe();

    state.voicePresenceChannels.set(room, channel);
  });
}

async function joinVoice(room) {
  if (!client || !currentIdentity()) {
    authMessage.textContent = "Choose Rasta Bum or Pigeon Crumb before joining voice.";
    return;
  }

  if (state.voiceRoom === room) return;
  await leaveVoice();

  state.voiceRoom = room;
  voiceRoomName.textContent = room;
  voicePanel.hidden = false;
  muteButton.disabled = true;
  setVoiceStatus("Waiting for someone else");
  renderVoiceButtons();

  subscribeVoicePresence();
  state.voiceChannel = state.voicePresenceChannels.get(room);

  if (!state.voiceChannel) {
    setVoiceStatus("Voice unavailable");
    return;
  }

  await state.voiceChannel.track({
    user_id: userId(),
    name: userLabel(),
    room,
    muted: state.voiceMuted,
    joined_at: new Date().toISOString()
  });
  setVoiceStatus("Waiting for someone else");
}

async function handleRoomPresence(roomPeerIds) {
  if (!state.voiceRoom) return;
  const peerIds = roomPeerIds.filter((id) => id !== userId());

  for (const peerId of [...state.voicePeers.keys()]) {
    if (!peerIds.includes(peerId)) closePeer(peerId);
  }

  if (!peerIds.length) {
    if (state.voiceStream) {
      state.voiceStream.getTracks().forEach((track) => track.stop());
      state.voiceStream = null;
      muteButton.disabled = true;
      muteButton.textContent = "Mute";
      state.voiceMuted = false;
    }
    setVoiceStatus("Waiting for someone else");
    return;
  }

  const audioReady = await ensureVoiceStream();
  if (!audioReady) return;

  for (const peerId of peerIds) {
    if (userId() > peerId && !state.voicePeers.has(peerId)) {
      await callPeer(peerId);
    }
  }

  setVoiceStatus(`${peerIds.length + 1} connected`);
}

async function leaveVoice() {
  if (state.voiceChannel) {
    await state.voiceChannel.untrack();
  }

  for (const peerId of [...state.voicePeers.keys()]) closePeer(peerId);
  state.voiceStream?.getTracks().forEach((track) => track.stop());
  remoteAudio.innerHTML = "";
  state.voiceRoom = null;
  state.voiceChannel = null;
  state.voiceStream = null;
  state.voiceMuted = false;
  muteButton.textContent = "Mute";
  muteButton.disabled = false;
  voicePanel.hidden = true;
  renderVoiceButtons();
}

async function toggleMute() {
  if (!state.voiceStream) {
    setVoiceStatus("Mic starts when someone joins");
    return;
  }
  state.voiceMuted = !state.voiceMuted;
  state.voiceStream.getAudioTracks().forEach((track) => {
    track.enabled = !state.voiceMuted;
  });
  muteButton.textContent = state.voiceMuted ? "Unmute" : "Mute";
  if (state.voiceChannel) {
    await state.voiceChannel.track({
      user_id: userId(),
      name: userLabel(),
      room: state.voiceRoom,
      muted: state.voiceMuted,
      joined_at: new Date().toISOString()
    });
  }
}

channels.forEach((button) => {
  button.addEventListener("click", async () => {
    channels.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.channel = button.dataset.channel;
    channelTitle.textContent = `# ${state.channel}`;
    updateTheme();
    messageInput.placeholder = currentIdentity() ? `Message #${state.channel}` : "Choose a profile to send a message";
    await loadMessages();
    if (currentIdentity()) subscribeToMessages();
  });
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!client) {
    authMessage.textContent = "Add your Supabase URL and anon key in config.js first.";
    return;
  }

  const email = document.querySelector("#emailInput").value.trim();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: config.SITE_URL || window.location.origin }
  });

  authMessage.textContent = error ? error.message : "Check your email for the sign-in link.";
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = messageInput.value.trim();
  if (!body) return;
  messageInput.value = "";
  await sendMessage(body);
});

signOutButton.addEventListener("click", async () => {
  await leaveVoice();
  if (client) await client.auth.signOut();
  state.persona = null;
  localStorage.removeItem("the-table:persona");
  setUser(null);
  renderMembers();
  await loadMessages();
});

inviteButton.addEventListener("click", async () => {
  const inviteText = `${window.location.origin}\n\nJoin me at The Table.`;
  await navigator.clipboard?.writeText(inviteText);
  inviteButton.textContent = "Copied";
  setTimeout(() => {
    inviteButton.textContent = "Invite";
  }, 1400);
});

voiceChannels.forEach((button) => {
  button.addEventListener("click", () => joinVoice(button.dataset.voiceRoom));
});

personaButtons.forEach((button) => {
  button.addEventListener("click", () => choosePersona(button.dataset.persona));
});

muteButton.addEventListener("click", toggleMute);
leaveVoiceButton.addEventListener("click", leaveVoice);

async function init() {
  await loadConfig();
  const savedPersona = localStorage.getItem("the-table:persona");
  if (savedPersona && personas[savedPersona]) {
    state.persona = personas[savedPersona];
  }
  setUser(null);
  renderMembers();

  if (!client) {
    setStatus("Setup needed");
    authMessage.textContent = "Create a Supabase project, run supabase/schema.sql, then update config.js.";
    state.messages = channelSeed();
    renderMessages();
    return;
  }

  subscribeVoicePresence();

  const { data } = await client.auth.getSession();
  setUser(data.session);
  renderMembers();

  client.auth.onAuthStateChange(async (_event, session) => {
    if (!session) await leaveVoice();
    if (session) {
      state.persona = null;
      localStorage.removeItem("the-table:persona");
    }
    setUser(session);
    renderMembers();
    await loadMessages();
    subscribeToMessages();
  });

  await loadMessages();
  updateTheme();
  if (currentIdentity()) subscribeToMessages();
}

init();
