import {
  REGRAS_PONTUACAO_META,
  esclarecimentosPontuacao,
  tabelaPontuacaoPartidas,
} from '@/lib/regras-pontuacao';
import { pageMetadata } from '@/lib/site-metadata';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { SiteFifaDisclaimer } from '@/components/SiteFifaDisclaimer/siteFifaDisclaimer';

export const metadata = pageMetadata(REGRAS_PONTUACAO_META.title, {
  description: REGRAS_PONTUACAO_META.description,
});

const sectionClass = 'mb-8 last:mb-0';
const h2Class = 'text-lg font-semibold text-neutral-900 mb-2';
const proseClass = 'text-sm text-neutral-700 space-y-3 leading-relaxed';
const listClass = 'list-disc pl-5 space-y-2';

export default function RegrasEPontuacaoPage() {
  return (
    <div className="max-w-3xl">
      <PageBreadcrumb label={REGRAS_PONTUACAO_META.title} className="mb-3" />
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">
        {REGRAS_PONTUACAO_META.title}
      </h1>
      <p className="text-sm text-neutral-600 mb-8">
        {REGRAS_PONTUACAO_META.description}
      </p>

      <section className={sectionClass} aria-labelledby="regras-palpites">
        <h2 id="regras-palpites" className={h2Class}>
          Palpites
        </h2>
        <div className={proseClass}>
          <ul className={listClass}>
            <li>
              Você dá <strong>um palpite por partida</strong> (placar do
              mandante × visitante).
            </li>
            <li>
              Esse palpite vale <strong>em todos os bolões</strong> nos quais
              você participa; não é preciso repetir por bolão.
            </li>
            <li>
              Você pode <strong>alterar</strong> o palpite até o{' '}
              <strong>horário marcado para o início do jogo</strong> (o mesmo
              que aparece para a partida no sistema); depois desse horário, o
              valor fica travado.
            </li>
          </ul>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="regras-pontos">
        <h2 id="regras-pontos" className={h2Class}>
          Pontuação
        </h2>
        <div className={proseClass}>
          <p>
            Quando a partida termina e o <strong>resultado oficial</strong>{' '}
            entra no sistema, seu palpite é comparado ao placar real. Vale a{' '}
            <strong>combinação de maior pontuação</strong> entre as regras
            abaixo (veja os esclarecimentos: a pontuação{' '}
            <strong>não é cumulativa</strong>).
          </p>
          <p>
            Na <strong>fase de grupos</strong>, usa-se a coluna
            &quot;Grupos&quot;. No <strong>mata-mata</strong>, os pontos seguem
            a coluna &quot;Mata-mata&quot;.
          </p>
          <p>
            No <strong>mata-mata</strong>, o placar usado para pontuar é o{' '}
            <strong>resultado final da partida em campo</strong> (tempo
            regulamentar e, se existir, prorrogação). Gols da decisão por
            pênaltis não entram no mandante × visitante — em jogos decididos nos
            pênaltis, costuma-se registrar o placar ao fim da prorrogação (por
            exemplo 1×1 antes dos pênaltis).
          </p>
          <p>
            Na tela de palpites, partidas já disputadas mostram o placar real e
            os pontos ganhos naquela partida (por exemplo{' '}
            <span className="font-semibold text-green-800">+10 pts</span>).
          </p>

          <div className="overflow-x-auto rounded-lg border border-neutral-200 mt-4">
            <table className="w-full text-sm text-left min-w-[min(100%,520px)]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="py-2 px-3 font-semibold text-neutral-900">
                    Descrição
                  </th>
                  <th className="py-2 px-3 font-semibold text-neutral-900 text-right whitespace-nowrap w-24">
                    Grupos
                  </th>
                  <th className="py-2 px-3 font-semibold text-neutral-900 text-right whitespace-nowrap w-28">
                    Mata-mata
                  </th>
                </tr>
              </thead>
              <tbody>
                {tabelaPontuacaoPartidas.map((row) => (
                  <tr key={row.titulo} className="border-b border-neutral-100">
                    <td className="py-2.5 px-3 align-top">
                      <div className="font-medium text-neutral-900">
                        {row.titulo}
                      </div>
                      <div className="text-neutral-600 mt-1 text-xs sm:text-sm">
                        {row.detalhe}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-top text-right tabular-nums font-semibold text-neutral-900 whitespace-nowrap">
                      {row.pontos}
                    </td>
                    <td className="py-2.5 px-3 align-top text-right tabular-nums font-semibold text-neutral-900 whitespace-nowrap">
                      {row.faseFinal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">
              Esclarecimentos
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
              {esclarecimentosPontuacao.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="regras-boloes">
        <h2 id="regras-boloes" className={h2Class}>
          Bolões e ranking
        </h2>
        <div className={proseClass}>
          <ul className={listClass}>
            <li>
              Cada bolão tem sua própria <strong>classificação</strong>:
              somam-se os pontos de todas as partidas em que você tem palpite
              válido.
            </li>
            <li>
              O ranking pode exibir o <strong>total</strong> e, quando
              disponível, a divisão entre pontos na{' '}
              <strong>fase de grupos</strong> e no <strong>mata-mata</strong>.
            </li>
            <li>
              Em caso de <strong>empate no total de pontos</strong>, o desempate
              é: mais palpites com <strong>placar exato</strong>; em seguida,
              ordem alfabética do nome de utilizador.
            </li>
            <li>
              Entrar em um bolão é feito por <strong>convite</strong> (link ou
              código). Quem cria o bolão é o administrador e pode usar a área
              dedicada para gerenciar participantes.
            </li>
          </ul>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="regras-simulacao">
        <h2 id="regras-simulacao" className={h2Class}>
          Simulação de grupos
        </h2>
        <div className={proseClass}>
          <p>
            Com base nos seus palpites nas partidas da fase de grupos, o app
            pode montar uma <strong>tabela simulada</strong> por grupo, útil
            para imaginar classificações antes do apito final. Isso é apenas uma
            projeção a partir dos seus palpites; a classificação oficial da Copa
            segue o regulamento da FIFA.
          </p>
        </div>
      </section>

      <SiteFifaDisclaimer />
    </div>
  );
}
