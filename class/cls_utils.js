
class Utils{

    static obtenerHoraActual(){
        const ahora = new Date();

        const dia = String(ahora.getDate()).padStart(2, '0');
        const mes = String(ahora.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por eso sumamos 1.
        const ano = ahora.getFullYear();

        const horas = String(ahora.getHours()).padStart(2, '0');
        const minutos = String(ahora.getMinutes()).padStart(2, '0');

        const fechaHoraFormato = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

        return fechaHoraFormato;
    }
}

module.exports = Utils;