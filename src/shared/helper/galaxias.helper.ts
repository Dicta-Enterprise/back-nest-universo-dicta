  export const generarTemaDesdeNombre=(nombre: string): string =>{
    if (!nombre) return 'galaxia';
    return nombre.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }