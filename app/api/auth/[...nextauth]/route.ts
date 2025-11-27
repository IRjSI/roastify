import NextAuth, { DefaultSession } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string | undefined
      refreshToken: string | undefined
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string | undefined
    refreshToken: string | undefined
  }
}

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: { params: { scope: "user-read-private user-read-email user-top-read" } }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at

        if (profile && profile.image) {
          token.picture = profile.image
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken

      session.user.image = token.picture as string | undefined
      return session
    }
  },
})

export { handler as GET, handler as POST }