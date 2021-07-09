import dayjs from 'dayjs';

export const sortDates = <T>(objArr: T[], key: keyof T): T[] =>
      objArr.sort(
            (a: any, b: any) => dayjs(b[key]).unix() - dayjs(a[key]).unix()
      );
