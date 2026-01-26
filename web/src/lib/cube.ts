import cubejs from "@cubejs-client/core"

const TOKEN = ""

export const cubeApi = cubejs(TOKEN, {
	apiUrl: import.meta.env.VITE_CUBE_API_URL,
})
