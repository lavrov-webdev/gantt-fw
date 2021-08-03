const getRichWorks = (works) => {
  //*Вывод работы без предшествующих работ на нулевой индекс
  works.forEach((workItem, index) => {
    if (workItem.in.length === 0) {
      works.splice(index, 1);
      works.unshift(workItem);
    }
  });

  //*Добавление к каждой работе поля с зависящями работами
  let worksUpdated = works.map((i) => ({
    ...i,
    out: works.reduce((accum, curr) => {
      if (curr.in.includes(i.id)) accum.push(curr.id);
      return accum;
    }, []),
  }));
  console.log(worksUpdated);

  //*Поиск всех путей в графе
  const findPaths = (item) => {
    if (!item.out.length) return [item.id];
    let path = [];
    item.out.forEach((forItem) => {
      let actualItem = worksUpdated.find((findItem) => findItem.id === forItem);
      let newArray = findPaths(actualItem);
      newArray.forEach((newArrItem) => {
        if (Array.isArray(newArrItem)) {
          path.push([...newArrItem, item.id]);
        } else {
          path.push([newArrItem, item.id]);
        }
      });
    });
    return path.reverse();
  };

  const paths = findPaths(worksUpdated[0]);

  //*Добавление к каждому пути время на этот путь
  const pathsWithTime = paths.map((path, pathId) => {
    const timeOfPath = path.reduce((accum, curr) => {
      return (accum += worksUpdated.find(
        (workFind) => workFind.id === curr
      ).time);
    }, 0);
    return { path, timeOfPath, pathId };
  });

  //*Поиск критического пути
  const criticalPath = pathsWithTime.reduce(
    (accum, curr) => {
      if (accum.time < curr.timeOfPath)
        return { path: curr.path, time: curr.timeOfPath };
      return accum;
    },
    { time: 0 }
  ).path;

  const mapAddESEfLsLf = (works, criticalPath) => {
    //*Нахождение earlyStart и earlyFinish дял каждого элемента. Преобразует массив worksUpdated
    //!Объеденить findEsEf и findLsLf в одну функцию не получится, т.к. тогда будет бесконечная рекурсия
    const findEsEf = (workId) => {
      let actualWork = works.find((w) => w.id === workId);
      if (actualWork.in.length === 0) {
        actualWork.earlyStart = 0;
        actualWork.lateStart = 0;
        actualWork.earlyFinish = actualWork.time;
        actualWork.lateFinish = actualWork.time;

        return {
          earlyStart: 0,
          earlyFinish: actualWork.time,
        };
      }

      const earlyStart = Math.max(
        ...actualWork.in.map((i) => findEsEf(i)).map((i) => i.earlyFinish)
      );
      const earlyFinish = earlyStart + actualWork.time;

      actualWork.earlyStart = earlyStart;
      actualWork.earlyFinish = earlyFinish;

      return {
        earlyStart,
        earlyFinish,
      };
    };

    //*Нахождение lateStart и lateFinish для каждого элемента. Преобразует массив worksUpdated
    //!Объеденить findEsEf и findLsLf в одну функцию не получится, т.к. тогда будет бесконечная рекурсия
    const findLsLf = (workId) => {
      let actualWork = works.find((w) => w.id === workId);
      if (actualWork.out.length === 0) {
        actualWork.lateStart = actualWork.earlyStart;
        actualWork.lateFinish = actualWork.earlyStart + actualWork.time;
        return {
          lateStart: actualWork.earlyStart,
          lateFinish: actualWork.earlyStart + actualWork.time,
        };
      }

      const lateFinish = Math.min(
        ...actualWork.out.map((i) => findLsLf(i)).map((i) => i.lateStart)
      );
      const lateStart = lateFinish - actualWork.time;

      actualWork.lateFinish = lateFinish;
      actualWork.lateStart = lateStart;

      return {
        lateStart,
        lateFinish,
      };
    };

    findEsEf(criticalPath[0]);
    findLsLf(criticalPath[criticalPath.length - 1]);

    return works;
  };

  worksUpdated = mapAddESEfLsLf(worksUpdated, criticalPath);

  criticalPath.forEach((i) => {
    worksUpdated.find((w) => w.id === i).inCritical = true;
  });

  let rerult = {
    works: worksUpdated,
    totalTime: worksUpdated.find((i) => i.id === criticalPath[0]).lateFinish,
  };

  return rerult;
};

export default getRichWorks;
