
const db = require('./model/db');
const prepareAgent = require('./data_prepare');
(async () => {
    const data = prepareAgent.prepareData()
    const dbInstanse = await db()


    const relationSet = new Set()
    try {
        for (let i = 0; i < data.length; i++) {

            const s = data[i]
            relationSet.clear()
            for (let j = 0; j < s.length;) {
                let insertValue = ""
                const unit = s.charAt(j)
                const unit2 = s.slice(j, j + 2)

                // 先找兩字再找一字, 避免兩字由一字的單位元組成
                if (prepareAgent.unitSet2.has(unit2)) {
                    insertValue = unit2
                    j += 2
                } else {
                    insertValue = unit
                    j++
                }
                const endCheck = (j === s.length)
                relationSet.add(insertValue)
                await dbInstanse.executeQuery('MERGE (:word {value: $value ,end: $end})',
                    {
                        value: insertValue,
                        end: endCheck
                    },
                    { database: 'neo4j' }
                )

            }

            const arrayLikeSet = Array.from(relationSet)
            for (let i = 0; i < arrayLikeSet.length - 1; i++) {
                await dbInstanse.executeQuery(`MATCH (a:word), (b:word)
                    WHERE a.value = $value1 AND a.end = false AND b.value = $value2
                    CREATE (b)-[: Concat]->(a)
                    `,
                    {
                        value1: arrayLikeSet[i],
                        value2: arrayLikeSet[i + 1]
                    },
                    { database: 'neo4j' }
                )
            }

        }
        // delete duplicate relation
        await dbInstanse.executeQuery(`match ()-[r]->() 
            match (s)-[r]->(e) 
            with s,e,type(r) as typ, tail(collect(r)) as coll 
            foreach(x in coll | delete x)`
        )
    } catch (e) {
        dbInstanse.close()
        throw e
    }
    dbInstanse.close()
})()
