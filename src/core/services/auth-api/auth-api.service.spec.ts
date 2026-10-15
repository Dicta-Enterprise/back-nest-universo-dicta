import { AuthApiService } from './auth-api.service';

jest.mock('src/config/envs', () => ({
  envs: { authApiUrl: 'http://auth.test', internalApiKey: 'clave-de-prueba-1234' },
}));

const respuesta = (status: number, body?: unknown) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response;

describe('AuthApiService', () => {
  const service = new AuthApiService();
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('manda la clave interna al listar familias', async () => {
    fetchMock.mockResolvedValue(respuesta(200, [{ id: 1 }]));
    const familias = await service.listarFamilias();
    expect(familias).toEqual([{ id: 1 }]);
    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toBe('http://auth.test/api/internal/familias');
    expect(opciones.headers['x-internal-api-key']).toBe('clave-de-prueba-1234');
  });

  it('lista usuarios mandando la clave y solo los filtros que vienen con valor', async () => {
    fetchMock.mockResolvedValue(respuesta(200, { items: [], total: 0, page: 1, limit: 20 }));
    await service.listarUsuarios({ q: 'sofía', rol: 'NINO', page: 2, estado: undefined, id: '' });
    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toBe('http://auth.test/api/internal/usuarios?q=sof%C3%ADa&rol=NINO&page=2');
    expect(opciones.headers['x-internal-api-key']).toBe('clave-de-prueba-1234');
  });

  it('lista usuarios sin signo de pregunta cuando no hay filtros', async () => {
    fetchMock.mockResolvedValue(respuesta(200, { items: [], total: 0, page: 1, limit: 20 }));
    await service.listarUsuarios();
    expect(fetchMock.mock.calls[0][0]).toBe('http://auth.test/api/internal/usuarios');
  });

  it('devuelve null si el padre no tiene familia (404)', async () => {
    fetchMock.mockResolvedValue(respuesta(404));
    await expect(service.obtenerFamiliaPorPadre(5)).resolves.toBeNull();
  });

  it('lanza 502 si auth responde con error', async () => {
    fetchMock.mockResolvedValue(respuesta(401));
    await expect(service.listarFamilias()).rejects.toThrow('error');
  });

  it('lanza 503 si no hay conexión', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'));
    await expect(service.listarFamilias()).rejects.toThrow('No se pudo conectar');
  });
});
