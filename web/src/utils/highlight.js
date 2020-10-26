import cloneRegexp from 'clone-regexp';
import diacritics from 'diacritics';

const mergeRange = ([...ranges]) => {
   if (!ranges.length) return [];

   ranges.sort((fir, sec) => {
      if (fir[0] !== sec[0]) return fir[0] - sec[0];
      return fir[1] - sec[1];
   });

   const merged = [];

   let curStart = ranges[0][0];
   let curEnd = ranges[0][1];

   ranges.shift();

   ranges.forEach(([start, end]) => {
      if (start >= curEnd) {
         merged.push([curStart, curEnd]);
         curStart = start;
         curEnd = end;
      } else if (end > curEnd) curEnd = end;
   });

   merged.push([curStart, curEnd]);

   return merged;
};



const indicesOf = (text, searchStringOrRegex,  { caseSensitive = false, diacriticsSensitive = false } = {} ) => {
   if (searchStringOrRegex instanceof RegExp) {
      const re = cloneRegexp(searchStringOrRegex, { global: true });
      const indices = [];

      let match = re.exec(text);
      while (match) {
         const offset = match.index + match[0].length;
         indices.push([match.index, offset]);
         match = re.exec(text);
      }
      return indices;
   }
   const searchStringLen = searchStringOrRegex.length;

   if (searchStringLen === 0) {
      return [];
   }

   const indices = [];

   let strCpy = text;
   let searchStringCpy = searchStringOrRegex;
   if (!caseSensitive) {
      strCpy = text.toLocaleLowerCase();
      searchStringCpy = searchStringOrRegex.toLocaleLowerCase();
   }

   if (!diacriticsSensitive) {
      strCpy = diacritics.remove(strCpy);
      searchStringCpy = diacritics.remove(searchStringCpy);
   }

   let startIndex = 0;
   let index = strCpy.indexOf(searchStringCpy, startIndex);
   while (index > -1) {
      startIndex = index + searchStringLen;
      indices.push([index, startIndex]);

      index = strCpy.indexOf(searchStringCpy, index + 1);
   }

   return indices;
}
export const highlightChunks = (text, queriesOrQuery, { caseSensitive = false, diacriticsSensitive = false } = {}) => {
   
   let queries = queriesOrQuery;
   if (typeof queriesOrQuery === 'string' || queriesOrQuery instanceof RegExp) {
      queries = [queriesOrQuery];
   } else if (!Array.isArray(queriesOrQuery)) {
      if (process.env.NODE_ENV !== 'production') {
         throw new Error('queries must be either string, array of strings or regex.');
      } else {
         return [];
      }
   }

   const matches = [];

   queries.forEach((query) => {
      matches.push(...indicesOf(text, query, { caseSensitive, diacriticsSensitive }));
   });

   const highlights = mergeRange(matches);

   const chunks = [];
   let lastEnd = 0;

   highlights.forEach(([start, end], index) => {
      if (lastEnd !== start) {
         chunks.push({
            isHighlighted: false,
            text: text.slice(lastEnd, start),
         });
      }
      chunks.push({
         isHighlighted: true,
         text: text.slice(start, end),
         highlightIndex: index,
      });

      lastEnd = end;
   });

   if (lastEnd !== text.length) {
      chunks.push({
         isHighlighted: false,
         text: text.slice(lastEnd),
      });
   }

   return chunks;
}