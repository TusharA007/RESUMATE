export const interviewRuntimeState = {
  idle: 'idle',
  warming: 'warming',
  listening: 'listening',
  thinking: 'thinking',
  speaking: 'speaking',
  evaluating: 'evaluating'
};

export class CareerAssistantRealtimeAdapter {
  constructor({ onEvent } = {}) {
    this.onEvent = onEvent;
    this.localStream = null;
    this.screenStream = null;
    this.peerConnection = null;
  }

  async enableCamera() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.emit('media.camera.ready', { stream: this.localStream });
    return this.localStream;
  }

  async shareScreen() {
    this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    this.emit('media.screen.ready', { stream: this.screenStream });
    return this.screenStream;
  }

  async connectSession() {
    this.peerConnection = new RTCPeerConnection();
    this.emit('session.ready', { state: interviewRuntimeState.warming });
    return this.peerConnection;
  }

  sendUserAudioFrame(frame) {
    this.emit('audio.frame', { frame });
  }

  sendTranscript(text) {
    this.emit('transcript.user', { text });
  }

  disconnect() {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.screenStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection?.close();
    this.emit('session.closed', { state: interviewRuntimeState.idle });
  }

  emit(type, payload) {
    this.onEvent?.({ type, payload, timestamp: Date.now() });
  }
}
