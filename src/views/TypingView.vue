<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import * as cheerio from 'cheerio'
import * as pako from 'pako'
import { useRoute } from 'vue-router'
import * as sass from 'sass'
import type { AnyNode } from 'domhandler'

const route = useRoute()

const novelBodyHtml = ref(``)
const novelPTextContent = ref(``)

const revealedChars = ref(1500)
const appearingChars = 25

// Fonction pour révéler progressivement le texte tout en gardant la structure HTML
const revealedHtml = computed(() => {
  const visibleText = novelPTextContent.value.slice(0, revealedChars.value) // Récupère les caractères visibles

  let currentIndex = 0
  let appearingCharsLeft = appearingChars

  const walker = (node: AnyNode) => {
    if (node.type === 'text' && node.parent && $(node).parents('p').length > 0) {
      const text = `${node.data}${node.next === null ? '\n' : ''}`
      const textLgth = text.length

      const data = text.slice(0, Math.min(textLgth, visibleText.length - currentIndex))

      currentIndex += data.length

      if (data.length < textLgth && appearingCharsLeft > 0) {
        const appearingChars = text.slice(data.length, data.length + appearingCharsLeft)
        const firstChar = appearingChars.at(0)
        const restChars = appearingChars.slice(1)
        const $parent = $(node.parent)

        if (node.parent.type === 'tag' && node.parent.name === 'p') {
          $parent.attr('style', 'text-align: left;')
        }

        $parent.append(
          appearingCharsLeft === 25
            ? `<span class="appearing-chars"><span class="cursor">${firstChar}</span>${restChars}</span>`
            : `<span class="appearing-chars">${firstChar}${restChars}</span>`,
        )
        appearingCharsLeft -= appearingChars.length
      }

      node.data = data
    } else if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach(walker)
    }
  }

  const $ = cheerio.load(novelBodyHtml.value)

  return cheerio
    .load(novelBodyHtml.value)
    .root()
    .contents()
    .each((_, el) => walker(el))
    .html()
})

// Fonction pour augmenter le nombre de caractères affichés
const onKeyPress = ({ key }: KeyboardEvent) => {
  if (!/[\p{L}\p{P}\s]|(?:Enter)/su.test(key)) return

  if (key === 'Enter') key = '\n'

  console.log(`Touche enfoncée : ${key} ${key?.charCodeAt(0)}`)
  const expected = novelPTextContent.value.at(revealedChars.value)
  console.log(`Touche attendu : ${expected} ${expected?.charCodeAt(0)}`)

  console.log(expected === key)
  console.log('keypress', revealedChars.value, novelPTextContent.value.length)

  if (
    revealedChars.value < novelPTextContent.value.length &&
    novelPTextContent.value.at(revealedChars.value) === key
  ) {
    revealedChars.value++
  }
}

window.addEventListener('keydown', onKeyPress)

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await fetch(`/api/novels/${id}`)
    const data = await response.json()

    console.log('data', data)

    const rawHtml = pako.ungzip(data.content.data, { to: 'string' })
    console.log('unzip', rawHtml)

    const $ = cheerio.load(rawHtml.replaceAll('œ', 'oe'))
    const $body = $('body')

    const body = $body.html()
    if (body === null) return

    novelBodyHtml.value = body

    novelPTextContent.value = $body
      .find('p')
      .map((_, el) =>
        $(el)
          .text()
          .trim()
          .replaceAll('\n', ' ')
          .replaceAll('’', "'")
          .replaceAll('œ', 'oe')
          .replaceAll(String.fromCharCode(160), ' '),
      ) // Récupère et nettoie le texte de chaque élément
      .get()
      .filter((text) => text.length > 0) // Supprime les lignes vides
      .join('\n') // Assemble les lignes avec des sauts de ligne

    console.log('body', novelPTextContent.value)

    for (const css of data.styles.map((style) => style.content.data)) {
      const content = pako.ungzip(css, { to: 'string' })
      loadCSS(content)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
  }
})

// Fonction pour ajouter dynamiquement un <link> dans <head>
function loadCSS(content: string) {
  const el = document.querySelector(`div.current-page`)
  if (!el) return
  const style = document.createElement('style')
  const scss = sass.compileString(
    `div.current-page {
      background-color: unset;
      color: black;
      font-family: georgia;
      font-size: 16px;
      word-spacing: 2px; /* Ajoute 10px d'espace entre chaque mot */
      padding-bottom: 100px;

      h1, h2 {
        display: block;
        font-size: 1.5em;
        font-weight: bold;
      }

      .appearing-chars {
        opacity: 0.3;

        .cursor {
          border-bottom: 2px solid black;
          padding-bottom: 5px;
        }

        .cursor2 {
          display: inline-block;
          position: absolute;
          bottom: -5px; /* Positionne le curseur sous la lettre */
          left: 0;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      }

      &.dark-mode {
        filter: invert(1) hue-rotate(180deg);
      }

      ${content.replace('@import "page.css";', '')}
    }`,
  )

  style.textContent = scss.css

  document.head.appendChild(style)
}
</script>

<template>
  <div v-html="revealedHtml" class="current-page dark-mode"></div>
</template>
